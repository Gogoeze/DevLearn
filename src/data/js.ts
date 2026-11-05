import type { CourseModule } from '../types'

export const jsModule: CourseModule = {
  id: 'js',
  title: 'JavaScript',
  description: 'Add behaviour: variables, functions, loops and page interaction.',
  lessons: [
    {
      id: 'js-variables',
      title: 'Variables and console.log',
      summary: 'Store a value and print it.',
      explanation: [
        'Variables store values. Use `const` for values that will not change and `let` for values that will.',
        '`console.log()` prints a value to the console, which is the best way to see what your code is doing.',
      ],
      snippet: `const city = "Lagos";
console.log(city);`,
      challenge: {
        task: 'Create a variable called `name` that holds your name, then print it with `console.log`.',
        starterCode: `<script>
  // Write your JavaScript here
</script>`,
        checks: [
          {
            label: 'Declares a variable called name',
            failMessage: 'Declare a variable called name using const or let.',
            test: ({ code }) => /\b(const|let|var)\s+name\b/.test(code),
          },
          {
            label: 'Prints something',
            failMessage: 'Nothing was printed. Use console.log(name) to print the variable.',
            test: ({ logs }) => logs.length > 0,
          },
          {
            label: 'Prints the value, not the word "name"',
            failMessage: 'Print the variable itself. Remove the quotes around name inside console.log.',
            test: ({ logs }) => logs.some((line) => line.trim() !== '' && line.trim() !== 'name'),
          },
        ],
        hints: [
          'Start with the keyword `const` or `let`, then the variable name.',
          '`const name = "Ada";` creates the variable. Put your own name in the quotes.',
          'Add a second line: `console.log(name);` with no quotes around `name`.',
        ],
        solution: `<script>
  const name = "Ada";
  console.log(name);
</script>`,
        solutionNote: 'The variable holds the text, and `console.log` prints whatever the variable holds.',
      },
    },
    {
      id: 'js-functions',
      title: 'Functions',
      summary: 'Reuse code with a name.',
      explanation: [
        'A function is a reusable block of code. You define it once and call it as many times as you like.',
        '`return` sends a value back to whoever called the function.',
      ],
      snippet: `function add(a, b) {
  return a + b;
}
console.log(add(2, 3)); // 5`,
      challenge: {
        task: 'Write a function called `greet` that takes a name and returns "Hello, " followed by the name and an exclamation mark. Log `greet("Ada")`.',
        starterCode: `<script>
  // Define greet, then log greet("Ada")
</script>`,
        checks: [
          {
            label: 'Defines a function called greet',
            failMessage: 'Define a function called greet.',
            test: ({ code }) => /function\s+greet\b|\bgreet\s*=/.test(code),
          },
          {
            label: 'greet("Ada") prints Hello, Ada!',
            failMessage: 'Calling greet("Ada") should print Hello, Ada! Check your spacing and punctuation.',
            test: ({ logs }) => logs.includes('Hello, Ada!'),
          },
        ],
        hints: [
          'A function starts with the `function` keyword, then its name and parameters in parentheses.',
          'Inside, return a string: `return "Hello, " + name + "!";`.',
          'Do not forget to call it: `console.log(greet("Ada"));`.',
        ],
        solution: `<script>
  function greet(name) {
    return "Hello, " + name + "!";
  }
  console.log(greet("Ada"));
</script>`,
        solutionNote: 'The function builds the greeting and returns it, and `console.log` prints what came back.',
      },
    },
    {
      id: 'js-loops',
      title: 'Loops',
      summary: 'Repeat work without copy and paste.',
      explanation: [
        'A `for` loop repeats code. It has three parts: where to start, when to stop, and how to count.',
        'Inside the loop, the counter variable changes on every pass.',
      ],
      snippet: `for (let i = 0; i < 3; i++) {
  console.log(i);
}`,
      challenge: {
        task: 'Print the numbers 1 to 5, one per line, using a loop.',
        starterCode: `<script>
  // Print 1 to 5 with a loop
</script>`,
        checks: [
          {
            label: 'Uses a loop',
            failMessage: 'Use a for loop instead of writing five console.log lines.',
            test: ({ code }) => /\b(for|while)\s*\(/.test(code),
          },
          {
            label: 'Prints 1, 2, 3, 4, 5 in order',
            failMessage: 'The console should show 1 to 5, in order. Check where your loop starts and stops.',
            test: ({ logs }) => JSON.stringify(logs) === JSON.stringify(['1', '2', '3', '4', '5']),
          },
        ],
        hints: [
          'A for loop needs a starting value, a stopping condition and a step.',
          'Start at 1 and keep going while `i <= 5`: `for (let i = 1; i <= 5; i++)`.',
          'Put `console.log(i);` inside the curly braces of the loop.',
        ],
        solution: `<script>
  for (let i = 1; i <= 5; i++) {
    console.log(i);
  }
</script>`,
        solutionNote: 'The loop starts at 1, runs while `i` is 5 or less, and adds 1 after every pass.',
      },
    },
    {
      id: 'js-dom',
      title: 'Changing the page',
      summary: 'React to a click.',
      explanation: [
        'The DOM is the page as JavaScript sees it. You can find an element with `document.querySelector()` and change it.',
        '`addEventListener` runs a function when something happens, such as a click.',
      ],
      snippet: `const title = document.querySelector("#title");
title.textContent = "Changed!";`,
      challenge: {
        task: 'When the button is clicked, change the heading text to "Clicked!".',
        starterCode: `<h1 id="title">Waiting...</h1>
<button id="btn">Click me</button>

<script>
  // Find the elements, then react to the click
</script>`,
        checks: [
          {
            label: 'Clicking the button changes the heading to "Clicked!"',
            failMessage:
              'After clicking the button, the heading should say Clicked! Make sure the click listener is on the button with id btn.',
            test: ({ doc }) => {
              const button = doc.getElementById('btn')
              const title = doc.getElementById('title')
              if (!button || !title) return false
              button.click()
              return title.textContent?.trim() === 'Clicked!'
            },
          },
        ],
        hints: [
          'First select both elements with `document.querySelector` or `document.getElementById`.',
          '`button.addEventListener("click", function () { ... })` runs code on every click.',
          'Inside the function, set `title.textContent = "Clicked!";`.',
        ],
        solution: `<h1 id="title">Waiting...</h1>
<button id="btn">Click me</button>

<script>
  const title = document.querySelector("#title");
  const button = document.querySelector("#btn");

  button.addEventListener("click", function () {
    title.textContent = "Clicked!";
  });
</script>`,
        solutionNote: 'The listener waits for a click, then runs the function that updates the heading.',
      },
    },
  ],
}
