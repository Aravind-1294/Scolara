import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const examLink = searchParams.get('link')

  if (!examLink) {
    return NextResponse.json({ error: 'Exam link is required' }, { status: 400 })
  }

  try {
    const response = await fetch(examLink)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching exam:', error)
    return NextResponse.json({ error: 'Failed to fetch exam data' }, { status: 500 })
  }
}