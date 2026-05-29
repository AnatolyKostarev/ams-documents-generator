import { SHARED_PACKAGE_VERSION } from '@docgenerator/shared'

export default function ApiHomePage() {
  return (
    <main>
      <h1>DocGenerator API</h1>
      <p>Service skeleton — endpoints under /api/*</p>
      <ul>
        <li>
          <a href="/api/health">GET /api/health</a>
        </li>
      </ul>
      <p style={{ fontSize: '0.875rem', color: '#737373' }}>
        @docgenerator/shared v{SHARED_PACKAGE_VERSION}
      </p>
    </main>
  )
}
