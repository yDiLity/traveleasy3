import { NextResponse } from 'next/server'
import { registerUser } from '../../auth/[...nextauth]/route'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Проверка наличия всех необходимых полей
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    // Регистрация пользователя
    const user = await registerUser(name, email, password)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 }
    )
  }
}
