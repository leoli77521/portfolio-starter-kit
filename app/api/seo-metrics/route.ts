import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

const storePath = path.join(process.cwd(), 'data', 'seo-monitoring.json')

export async function GET() {
  try {
    const store = JSON.parse(await fs.readFile(storePath, 'utf8'))
    const latest = store.snapshots?.at(-1) || null

    return NextResponse.json(
      {
        property: store.property,
        timezone: store.timezone,
        updatedAt: store.updatedAt,
        latest,
        snapshotCount: store.snapshots?.length || 0,
        notes: store.notes || [],
      },
      {headers: {'Cache-Control': 'no-store, max-age=0'}}
    )
  } catch (error) {
    return NextResponse.json(
      {error: error instanceof Error ? error.message : 'Unable to read SEO metrics'},
      {status: 500}
    )
  }
}
