import { parseRgb } from '../lib/checker'
import type { CourseModule } from '../types'

export const cssModule: CourseModule = {
  id: 'css',
  title: 'CSS',
  description: 'Make pages look good: colour, spacing, text and layout.',
  lessons: [
    {
      id: 'css-color',
      title: 'Selectors and colour',
      summary: 'Pick an element and change how it looks.',
      explanation: [
        'CSS controls how HTML looks. A rule has a `selector` that picks elements, and a block of `property: value;` pairs inside curly braces.',
        '`color` sets text colour. You can use names like `blue`, hex codes like `#2563eb`, or `rgb()` values.',
      ],
      snippet: `h1 {
  color: tomato;
}`,
      challenge: {
        task: 'Make the heading blue.',
        starterCode: `<style>
  /* Write your CSS here */
</style>

<h1>Hello, CSS</h1>
<p>Style me next.</p>`,
        checks: [
          {
            label: 'Property is spelled the CSS way',
            failMessage: 'CSS spells it color, without the u.',
            test: ({ code }) => !/colour\s*:/i.test(code),
          },
          {
            label: 'The heading is blue',
            failMessage: 'The heading is not blue yet. Add a rule for h1 that sets its color.',
            test: ({ doc, win }) => {
              const h1 = doc.querySelector('h1')
              const rgb = h1 ? parseRgb(win.getComputedStyle(h1).color) : null
              if (!rgb) return false
              const [r, g, b] = rgb
              return b >= 120 && b > r + 40 && b > g + 10
            },
          },
        ],
        hints: [
          'Write a rule that starts with the selector `h1` and a pair of curly braces.',
          'Inside the braces, use the `color` property followed by a colon and a value.',
          '`h1 { color: blue; }` goes between the style tags.',
        ],
        solution: `<style>
  h1 {
    color: blue;
  }
</style>

<h1>Hello, CSS</h1>
<p>Style me next.</p>`,
        solutionNote: 'The selector `h1` picks the heading, and `color: blue;` is one property and value inside the rule.',
      },
    },
    {
      id: 'css-box-model',
      title: 'The box model',
      summary: 'Padding, border and margin.',
      explanation: [
        'Every element is a box. From the inside out: the content, `padding` (space inside the border), the `border`, and `margin` (space outside).',
        'Padding pushes content away from the edge of its own box. Margin pushes other elements away.',
      ],
      snippet: `.card {
  padding: 16px;
  border: 1px solid #ccc;
  margin: 24px;
}`,
      challenge: {
        task: 'Give the `.card` 24px of padding, a visible border, and 32px of margin.',
        starterCode: `<style>
  .card {
    background: #f1f5f9;
  }
</style>

<div class="card">I am a card.</div>`,
        checks: [
          {
            label: 'Padding is 24px',
            failMessage: 'Padding should be 24px. Padding is the space inside the box, between the text and the border.',
            test: ({ doc, win }) => {
              const card = doc.querySelector('.card')
              return Boolean(card && win.getComputedStyle(card).paddingTop === '24px')
            },
          },
          {
            label: 'Has a visible border',
            failMessage: 'The card needs a border with a width, a style and a colour, like 2px solid gray.',
            test: ({ doc, win }) => {
              const card = doc.querySelector('.card')
              if (!card) return false
              const style = win.getComputedStyle(card)
              return style.borderTopWidth !== '0px' && style.borderTopStyle !== 'none'
            },
          },
          {
            label: 'Margin is 32px',
            failMessage: 'Margin should be 32px. Margin is the space outside the box.',
            test: ({ doc, win }) => {
              const card = doc.querySelector('.card')
              return Boolean(card && win.getComputedStyle(card).marginTop === '32px')
            },
          },
        ],
        hints: [
          'Three properties are involved: `padding`, `border` and `margin`.',
          'Each takes a value like `24px`. A border needs a width, a style and a colour, like `2px solid gray`.',
          'Inside the `.card` rule: `padding: 24px; border: 2px solid gray; margin: 32px;`.',
        ],
        solution: `<style>
  .card {
    background: #f1f5f9;
    padding: 24px;
    border: 2px solid gray;
    margin: 32px;
  }
</style>

<div class="card">I am a card.</div>`,
        solutionNote: 'Padding grows the box inwards, the border draws its edge, and margin pushes neighbours away.',
      },
    },
    {
      id: 'css-text',
      title: 'Styling text',
      summary: 'Size, weight and alignment.',
      explanation: [
        'Text styling uses properties like `font-size`, `font-weight`, `text-align` and `line-height`.',
        'Sizes are usually in `px` or `rem`. `1rem` is the browser default size, normally 16px.',
      ],
      snippet: `p {
  font-size: 18px;
  text-align: center;
}`,
      challenge: {
        task: 'Make every paragraph 20px, bold, and centred.',
        starterCode: `<style>
  /* Style the paragraphs */
</style>

<p>CSS gives text its personality.</p>
<p>Make me stand out.</p>`,
        checks: [
          {
            label: 'Font size is 20px',
            failMessage: 'Set font-size to 20px on the p selector so both paragraphs change.',
            test: ({ doc, win }) => {
              const items = Array.from(doc.querySelectorAll('p'))
              return items.length > 0 && items.every((p) => win.getComputedStyle(p).fontSize === '20px')
            },
          },
          {
            label: 'Text is bold',
            failMessage: 'Make the text bold with font-weight.',
            test: ({ doc, win }) => {
              const items = Array.from(doc.querySelectorAll('p'))
              return items.length > 0 && items.every((p) => parseInt(win.getComputedStyle(p).fontWeight, 10) >= 600)
            },
          },
          {
            label: 'Text is centred',
            failMessage: 'Centre the text with text-align.',
            test: ({ doc, win }) => {
              const items = Array.from(doc.querySelectorAll('p'))
              return items.length > 0 && items.every((p) => win.getComputedStyle(p).textAlign === 'center')
            },
          },
        ],
        hints: [
          'Use the `p` selector so both paragraphs change at once.',
          'You need three properties: `font-size`, `font-weight` and `text-align`.',
          '`p { font-size: 20px; font-weight: bold; text-align: center; }`.',
        ],
        solution: `<style>
  p {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
</style>

<p>CSS gives text its personality.</p>
<p>Make me stand out.</p>`,
        solutionNote: 'One rule on `p` styles every paragraph on the page.',
      },
    },
    {
      id: 'css-flexbox',
      title: 'Flexbox layout',
      summary: 'Line items up in a row.',
      explanation: [
        'Flexbox lays children out in a row or a column. Set `display: flex` on the parent and its direct children line up side by side.',
        '`gap` adds space between items, and `justify-content` controls how they spread along the row.',
      ],
      snippet: `.row {
  display: flex;
  gap: 16px;
  justify-content: center;
}`,
      challenge: {
        task: 'Put the three boxes in one row, with 16px of space between them.',
        starterCode: `<style>
  .box {
    background: #c7d2fe;
    padding: 16px;
  }
  .row {
    /* Make this a flex container */
  }
</style>

<div class="row">
  <div class="box">One</div>
  <div class="box">Two</div>
  <div class="box">Three</div>
</div>`,
        checks: [
          {
            label: '.row is a flex container',
            failMessage: 'Add display: flex to the .row rule. The boxes are its children.',
            test: ({ doc, win }) => {
              const row = doc.querySelector('.row')
              return Boolean(row && /flex/.test(win.getComputedStyle(row).display))
            },
          },
          {
            label: 'The boxes sit in one row',
            failMessage: 'The boxes are still stacked. Flex puts them side by side once the parent has display: flex.',
            test: ({ doc }) => {
              const tops = Array.from(doc.querySelectorAll('.box')).map((b) => Math.round(b.getBoundingClientRect().top))
              return tops.length === 3 && tops.every((t) => t === tops[0])
            },
          },
          {
            label: 'Gap is 16px',
            failMessage: 'Add gap: 16px to the .row rule to space the boxes out.',
            test: ({ doc, win }) => {
              const row = doc.querySelector('.row')
              return Boolean(row && win.getComputedStyle(row).columnGap === '16px')
            },
          },
        ],
        hints: [
          'The rule to change is `.row`, the parent of the three boxes.',
          'Flexbox starts with `display: flex`. Spacing between items uses `gap`.',
          '`.row { display: flex; gap: 16px; }`.',
        ],
        solution: `<style>
  .box {
    background: #c7d2fe;
    padding: 16px;
  }
  .row {
    display: flex;
    gap: 16px;
  }
</style>

<div class="row">
  <div class="box">One</div>
  <div class="box">Two</div>
  <div class="box">Three</div>
</div>`,
        solutionNote: 'Flex is set on the parent, and it controls how the children are laid out.',
      },
    },
  ],
}
