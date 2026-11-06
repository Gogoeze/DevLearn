import { hasText } from '../lib/checker'
import type { CourseModule } from '../types'

export const htmlModule: CourseModule = {
  id: 'html',
  title: 'HTML',
  description: 'The structure of every web page: headings, text, links, lists and images.',
  lessons: [
    {
      id: 'html-headings',
      free: true,
      title: 'Headings and paragraphs',
      summary: 'Give a page a title and some text.',
      explanation: [
        'HTML describes the structure of a page using `tags`. Most tags come in pairs: an opening tag like `<h1>` and a closing tag like `</h1>`, with content in between.',
        'Headings run from `<h1>` (the most important) down to `<h6>`. Paragraphs of text use `<p>`.',
      ],
      snippet: `<h1>My first page</h1>
<p>This is a paragraph.</p>`,
      challenge: {
        task: 'Add a main heading (`h1`) with a title of your choice, then a paragraph (`p`) below it that says something about yourself.',
        starterCode: '<!-- Write your HTML here -->\n',
        checks: [
          {
            label: 'Has an h1 heading with text',
            failMessage: 'I cannot find an h1 with text in it yet. Headings use the h1 tag.',
            test: ({ doc }) => hasText(doc.querySelector('h1')),
          },
          {
            label: 'Has a paragraph with text',
            failMessage: 'I cannot find a paragraph yet. Paragraphs use the p tag.',
            test: ({ doc }) => hasText(doc.querySelector('p')),
          },
          {
            label: 'Tags are closed',
            failMessage: 'Each tag needs a closing tag, like </h1> and </p>. Check that yours are all closed.',
            test: ({ code }) => /<\/h1>/i.test(code) && /<\/p>/i.test(code),
          },
          {
            label: 'Heading comes before the paragraph',
            failMessage: 'Put the heading first, then the paragraph underneath it.',
            test: ({ doc }) => {
              const h1 = doc.querySelector('h1')
              const p = doc.querySelector('p')
              return Boolean(h1 && p && h1.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING)
            },
          },
        ],
        hints: [
          'Headings use a tag that starts with h. The biggest heading is `h1`.',
          'Wrap your title like this: `<h1>Your title</h1>`. Paragraphs work the same way with `p`.',
          'You need two lines: one `<h1>...</h1>` and, underneath it, one `<p>...</p>`.',
        ],
        solution: `<h1>Hi, I'm Ada</h1>
<p>I'm learning to  build websites.</p>`,
        solutionNote:
          'Both tags wrap their text with an opening and a closing tag. The `h1` comes first so it appears at the top.',
      },
    },
    {
      id: 'html-links',
      title: 'Links',
      summary: 'Connect pages together.',
      explanation: [
        'Links use the `<a>` tag. The `href` attribute holds the address, and the text between the tags is what people click.',
        'Attributes sit inside the opening tag as `name="value"` pairs.',
      ],
      snippet: '<a href="https://developer.mozilla.org">Visit MDN</a>',
      challenge: {
        task: 'Create a link to `https://example.com` with the text "Visit Example".',
        starterCode: '<p>Learn more on another site:</p>\n<!-- Add your link below -->\n',
        checks: [
          {
            label: 'Has a link',
            failMessage: 'I cannot find a link yet. Links use the a tag.',
            test: ({ doc }) => Boolean(doc.querySelector('a')),
          },
          {
            label: 'Points to https://example.com',
            failMessage: 'The link needs an href attribute that points to https://example.com.',
            test: ({ doc }) => Boolean(doc.querySelector('a')?.getAttribute('href')?.startsWith('https://example.com')),
          },
          {
            label: 'Link text is "Visit Example"',
            failMessage: 'The text between the tags should be exactly "Visit Example".',
            test: ({ doc }) => doc.querySelector('a')?.textContent?.trim() === 'Visit Example',
          },
        ],
        hints: [
          'Links use the `a` tag, which stands for anchor.',
          'The address goes in an `href` attribute inside the opening tag: `<a href="...">`.',
          'Put the text between the tags: `<a href="https://example.com">...</a>`.',
        ],
        solution: `<p>Learn more on another site:</p>
<a href="https://example.com">Visit Example</a>`,
        solutionNote: 'The `href` says where the link goes. The text between the tags is what the reader sees.',
      },
    },
    {
      id: 'html-lists',
      title: 'Lists',
      summary: 'Group related items together.',
      explanation: [
        'Use `<ul>` for a bulleted list and `<ol>` for a numbered one. Each item goes in its own `<li>`.',
        'A list item must live inside a list. A `<li>` on its own is not valid.',
      ],
      snippet: `<ul>
  <li>HTML</li>
  <li>CSS</li>
</ul>`,
      challenge: {
        task: 'Make a bulleted list of three foods you like.',
        starterCode: '<h2>My favorite foods</h2>\n',
        checks: [
          {
            label: 'Has a bulleted list',
            failMessage: 'I cannot find a bulleted list. An unordered list uses the ul tag.',
            test: ({ doc }) => Boolean(doc.querySelector('ul')),
          },
          {
            label: 'Has at least 3 items inside the list',
            failMessage: 'Each food needs its own li tag, and all of them go inside the ul.',
            test: ({ doc }) => doc.querySelectorAll('ul > li').length >= 3,
          },
          {
            label: 'Every item has text',
            failMessage: 'One of your list items is empty. Put a food name between its li tags.',
            test: ({ doc }) => {
              const items = Array.from(doc.querySelectorAll('ul > li'))
              return items.length > 0 && items.every(hasText)
            },
          },
        ],
        hints: [
          'A bulleted list is called an unordered list.',
          'Start with `<ul>`, then add one `<li>` for every item.',
          'Three `<li>food</li>` lines between `<ul>` and `</ul>`, with your own foods.',
        ],
        solution: `<h2>My favorite foods</h2>
<ul>
  <li>Jollof rice</li>
  <li>Suya</li>
  <li>Plantain</li>
</ul>`,
        solutionNote: 'The `ul` is the container, and each `li` is one bullet inside it.',
      },
    },
    {
      id: 'html-images',
      title: 'Images',
      summary: 'Show a picture and describe it.',
      explanation: [
        'Images use the `<img>` tag. It has no closing tag, so it is written on its own.',
        '`src` is where the image lives. `alt` is a text description for screen readers and for when the image fails to load. Always include it.',
      ],
      snippet: '<img src="https://picsum.photos/200" alt="A random photo" />',
      challenge: {
        task: 'Add an image from any web address and give it a helpful `alt` text.',
        starterCode: '<h2>Photo of the day</h2>\n',
        checks: [
          {
            label: 'Has an image',
            failMessage: 'I cannot find an image yet. Images use the img tag.',
            test: ({ doc }) => Boolean(doc.querySelector('img')),
          },
          {
            label: 'Image has a src',
            failMessage: 'The image needs a src attribute with its web address.',
            test: ({ doc }) => Boolean(doc.querySelector('img')?.getAttribute('src')?.trim()),
          },
          {
            label: 'Image has a descriptive alt text',
            failMessage: 'Add an alt attribute that describes the image in a few words.',
            test: ({ doc }) => (doc.querySelector('img')?.getAttribute('alt')?.trim().length ?? 0) >= 3,
          },
        ],
        hints: [
          'Images use the `img` tag. It has no closing tag.',
          'It needs two attributes: `src` (the address) and `alt` (a description).',
          '`<img src="https://picsum.photos/200" alt="..." />` with your own description in the alt.',
        ],
        solution: `<h2>Photo of the day</h2>
<img src="https://picsum.photos/200" alt="A random landscape photo" />`,
        solutionNote: 'If the image cannot load, the browser shows the `alt` text instead, and screen readers read it aloud.',
      },
    },
  ],
}
