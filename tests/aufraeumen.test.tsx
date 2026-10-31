import { expect, test } from 'claude-code/testing'
import type { PromptChangeInput } from 'claude-code'

// Die Engine raised 'prompt.change' im Test, die Test-Typings dieses Builds
// führen es aber (noch) nicht auf $.prompt. Darum dieser schmale Helfer.
type MitChange = { prompt: { change: (e: PromptChangeInput) => Promise<unknown> } }
const aendere = ($: unknown, text: string) =>
  ($ as MitChange).prompt.change({ text, cursor: text.length, origin: { kind: 'engine' } })

const BAND = {
  plugin: 'prompt-aufraeumer',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 10 },
    view: {},
  },
} as const

const LANG = 'Also ich will äh dass du die Datei liest, nein Moment, die Datei umbenennst. '.repeat(4)
const FASSUNG = '## Ziel\nDatei umbenennen.'

for (const surface of ['terminal', 'desktop'] as const) {
  test(`langer Entwurf: Aufräumen, dann Original zurück (${surface})`, async ($, on) => {
    let box = ''
    const fills: string[] = []
    let gesendet = ''

    on('prompt.read', () => ({ value: { text: box, cursor: box.length } }))
    on('prompt.fill', (_, e) => {
      box = e.text
      fills.push(e.text)
      return { isFilled: true, text: box, cursor: box.length }
    })
    on('model.complete', (_, e) => {
      gesendet = e.prompt
      return { value: { isAnswered: true, text: FASSUNG, usage: { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } } }
    })
    on('prompt.change', (_, e) => ({ text: e.text }))

    box = LANG
    await aendere($, LANG)

    const ui = await $.ui.mount({ ...BAND, surface })
    expect(await ui.find({ key: 'aufraeumen' })).toBeTruthy()

    await ui.press({ key: 'aufraeumen' })
    expect(gesendet).toContain(LANG.trim())
    expect(fills.at(-1)).toBe(FASSUNG)
    expect(await ui.find({ key: 'zurueck' })).toBeTruthy()

    await ui.press({ key: 'zurueck' })
    expect(fills.at(-1)).toBe(LANG)
    expect(await ui.find({ key: 'zurueck' })).toBeFalsy()
    await ui.unmount()
  })
}

test('kurzer Entwurf und Slash-Command bekommen kein Band', async ($, on) => {
  on('prompt.change', (_, e) => ({ text: e.text }))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine</Text>
  })

  await aendere($, 'kurz')
  let ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await ui.find({ key: 'aufraeumen' })).toBeFalsy()
  await ui.unmount()

  const slash = '/review ' + 'x'.repeat(300)
  await aendere($, slash)
  ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await ui.find({ key: 'aufraeumen' })).toBeFalsy()
  await ui.unmount()
})

test('Modellfehler lässt den Entwurf unverändert', async ($, on) => {
  const box = 'y'.repeat(250)
  const fills: string[] = []
  on('prompt.read', () => ({ value: { text: box, cursor: box.length } }))
  on('prompt.fill', (_, e) => {
    fills.push(e.text)
    return { isFilled: true, text: e.text, cursor: e.text.length }
  })
  on('model.complete', () => ({ value: { isAnswered: false, reason: 'empty-reply', usage: { input_tokens: 1, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } } }))
  on('ui.toast', () => ({ value: undefined }))
  on('prompt.change', (_, e) => ({ text: e.text }))

  await aendere($, box)
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await ui.press({ key: 'aufraeumen' })
  expect(fills).toEqual([])
  expect(await ui.find({ key: 'aufraeumen' })).toBeTruthy()
  await ui.unmount()
})
