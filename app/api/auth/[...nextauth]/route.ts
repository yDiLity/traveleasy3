import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"

// Это простая база данных пользователей для демонстрации
// В реальном приложении вы бы использовали настоящую базу данных
let users = [
  {
    id: "1",
    name: "Иван Петров",
    email: "ivan@example.com",
    password: "password123",
    image: "https://i.pravatar.cc/150?u=ivan@example.com",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Мария Иванова",
    email: "maria@example.com",
    password: "password123",
    image: "https://i.pravatar.cc/150?u=maria@example.com",
    createdAt: new Date().toISOString(),
  },
]

// Функция для регистрации нового пользователя
// В реальном приложении это был бы запрос к базе данных
export async function registerUser(name: string, email: string, password: string) {
  // Проверка, что пользователь с таким email не существует
  const existingUser = users.find(user => user.email === email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // Создание нового пользователя
  const newUser = {
    id: String(users.length + 1),
    name,
    email,
    password, // В реальном приложении пароль был бы хеширован
    image: `https://i.pravatar.cc/150?u=${email}`,
    createdAt: new Date().toISOString(),
  }

  // Добавление пользователя в "базу данных"
  users.push(newUser)

  return { id: newUser.id, name: newUser.name, email: newUser.email }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Учетные данные",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Пароль", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Поиск пользователя в нашей "базе данных"
        const user = users.find(user => user.email === credentials.email)

        // Проверка пароля
        if (user && user.password === credentials.password) {
          // Возвращаем объект пользователя без пароля
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
