/**
 * Web Developer Internship Project - Question Bank
 * Contains questions categorized by topic (HTML, CSS, JavaScript, General Programming)
 * and difficulty (Easy, Medium, Hard).
 * Includes multiple formats: Single Choice (radio), Multiple Select (checkboxes), and Fill-in-the-Blank.
 */

export const questionBank = {
  html: {
    easy: [
      {
        id: "html_e1",
        type: "single",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Transfer Machine Language",
          "Home Tool Markup Language",
          "Hyperlink Text Management Language"
        ],
        answer: "Hyper Text Markup Language",
        explanation: "HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages."
      },
      {
        id: "html_e2",
        type: "single",
        question: "Which HTML element is used to define the most important heading?",
        options: [
          "&lt;heading&gt;",
          "&lt;h6&gt;",
          "&lt;h1&gt;",
          "&lt;head&gt;"
        ],
        answer: "<h1>",
        explanation: "The &lt;h1&gt; tag defines the most important heading, while &lt;h6&gt; defines the least important heading."
      },
      {
        id: "html_e3",
        type: "multiple",
        question: "Select all elements that are structural/semantic HTML5 sectioning elements:",
        options: [
          "&lt;article&gt;",
          "&lt;section&gt;",
          "&lt;div&gt;",
          "&lt;aside&gt;"
        ],
        answer: ["<article>", "<section>", "<aside>"],
        explanation: "&lt;article&gt;, &lt;section&gt;, and &lt;aside&gt; are semantic elements introduced in HTML5. &lt;div&gt; is a generic division container with no semantic meaning."
      },
      {
        id: "html_e4",
        type: "blank",
        question: "The HTML element used to create a hyperlink is designated by the character or tag: ______.",
        answer: "a",
        placeholder: "e.g., 'a' or '<a>'",
        altAnswers: ["<a>", "anchor"],
        explanation: "The &lt;a&gt; (anchor) element, with its href attribute, is used to create hyperlinks."
      },
      {
        id: "html_e5",
        type: "single",
        question: "Which HTML tag is used to create an unordered list?",
        options: [
          "&lt;ol&gt;",
          "&lt;ul&gt;",
          "&lt;li&gt;",
          "&lt;list&gt;"
        ],
        answer: "<ul>",
        explanation: "An unordered list starts with the &lt;ul&gt; tag. An ordered list starts with &lt;ol&gt;."
      }
    ],
    medium: [
      {
        id: "html_m1",
        type: "single",
        question: "What is the correct HTML element for playing audio files?",
        options: [
          "&lt;sound&gt;",
          "&lt;audio&gt;",
          "&lt;music&gt;",
          "&lt;play&gt;"
        ],
        answer: "<audio>",
        explanation: "HTML5 introduced the semantic &lt;audio&gt; element to embed sound content in documents."
      },
      {
        id: "html_m2",
        type: "multiple",
        question: "Which attributes are strictly required for a valid &lt;img&gt; tag to follow good accessibility guidelines?",
        options: [
          "src",
          "alt",
          "width",
          "title"
        ],
        answer: ["src", "alt"],
        explanation: "While 'src' defines the image source path, the 'alt' attribute is required for screen readers and accessibility fallback."
      },
      {
        id: "html_m3",
        type: "blank",
        question: "To specify that an input field in a form is mandatory before submission, use the HTML5 attribute: _______.",
        answer: "required",
        placeholder: "e.g., required",
        altAnswers: ["required=\"required\""],
        explanation: "The 'required' boolean attribute specifies that the user must fill in a value before submitting the form."
      },
      {
        id: "html_m4",
        type: "single",
        question: "In HTML5, which semantic tag is best suited to wrap independent, self-contained content (like blog posts or forum replies)?",
        options: [
          "&lt;section&gt;",
          "&lt;div&gt;",
          "&lt;article&gt;",
          "&lt;main&gt;"
        ],
        answer: "<article>",
        explanation: "The &lt;article&gt; element represents a complete, self-contained composition in a document, page, application, or site."
      }
    ],
    hard: [
      {
        id: "html_h1",
        type: "single",
        question: "Which HTML5 API allows a web application to store data locally within the user's browser with no expiration date?",
        options: [
          "SessionStorage",
          "Cookies",
          "LocalStorage",
          "Web SQL"
        ],
        answer: "LocalStorage",
        explanation: "LocalStorage stores data with no expiration date, whereas SessionStorage data is cleared when the page session ends."
      },
      {
        id: "html_h2",
        type: "multiple",
        question: "Select all valid void elements in HTML (elements that do not require a closing tag):",
        options: [
          "&lt;br&gt;",
          "&lt;hr&gt;",
          "&lt;img&gt;",
          "&lt;p&gt;"
        ],
        answer: ["<br>", "<hr>", "<img>"],
        explanation: "Void elements like &lt;br&gt;, &lt;hr&gt;, and &lt;img&gt; cannot have children and do not have closing tags, whereas &lt;p&gt; is a normal container element."
      },
      {
        id: "html_h3",
        type: "blank",
        question: "What is the name of the attribute used on an &lt;iframe&gt; to restrict its capabilities/permissions for safety security sandbox reasons? Name only the attribute: _______.",
        answer: "sandbox",
        placeholder: "Enter attribute name",
        explanation: "The 'sandbox' attribute enables an extra set of restrictions for the content in the iframe, enhancing web security."
      }
    ]
  },
  css: {
    easy: [
      {
        id: "css_e1",
        type: "single",
        question: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Cascading Style Sheets",
          "Creative Style Sheets",
          "Colorful Style Sheets"
        ],
        answer: "Cascading Style Sheets",
        explanation: "CSS stands for Cascading Style Sheets, detailing how HTML elements are to be displayed on screen."
      },
      {
        id: "css_e2",
        type: "single",
        question: "Which property is used in CSS to change the background color of an element?",
        options: [
          "color",
          "bgcolor",
          "background-color",
          "surface-color"
        ],
        answer: "background-color",
        explanation: "The 'background-color' property sets the background color of an element. 'color' changes the text color."
      },
      {
        id: "css_e3",
        type: "multiple",
        question: "Which of the following are valid CSS length units?",
        options: [
          "px",
          "rem",
          "vh",
          "lb"
        ],
        answer: ["px", "rem", "vh"],
        explanation: "'px' (pixels), 'rem' (root em), and 'vh' (viewport height) are standard CSS units. 'lb' is a unit of mass (pounds), not a css length unit."
      },
      {
        id: "css_e4",
        type: "blank",
        question: "To make a element's corners rounded in CSS, we use the property: _______-radius.",
        answer: "border",
        placeholder: "e.g., border",
        explanation: "The CSS property 'border-radius' is used to define the radius of the element's corners, making them rounded."
      }
    ],
    medium: [
      {
        id: "css_m1",
        type: "single",
        question: "What is the default value of the postion property in CSS?",
        options: [
          "relative",
          "absolute",
          "static",
          "fixed"
        ],
        answer: "static",
        explanation: "HTML elements are positioned 'static' by default. This position always follows the normal flow of the page."
      },
      {
        id: "css_m2",
        type: "multiple",
        question: "Which CSS flexbox alignment properties apply to the main axis alignment and cross axis alignment respectively?",
        options: [
          "justify-content",
          "align-items",
          "flex-direction",
          "align-content"
        ],
        answer: ["justify-content", "align-items"],
        explanation: "'justify-content' aligns items along the primary (main) axis, while 'align-items' aligns items along the perpendicular (cross) axis."
      },
      {
        id: "css_m3",
        type: "blank",
        question: "In the CSS box model, the space between the element's content and its border is known as: _______.",
        answer: "padding",
        placeholder: "padding",
        explanation: "Padding is the space inside an element, between its actual content area and its borders."
      },
      {
        id: "css_m4",
        type: "single",
        question: "How do you select an element with id 'demo' in a CSS stylesheet?",
        options: [
          ".demo",
          "#demo",
          "demo",
          "*demo"
        ],
        answer: "#demo",
        explanation: "The '#' symbol is used to select elements by their ID, while the '.' symbol selects elements by class name."
      }
    ],
    hard: [
      {
        id: "css_h1",
        type: "single",
        question: "Calculate CSS specificity: Which selector has the highest precedence?",
        options: [
          "div.container ul.list li",
          "#primaryNav li.active",
          "body #wrapper .sidebar div p",
          "header nav a:hover"
        ],
        answer: "#primaryNav li.active",
        explanation: "Specificity calculations: '#primaryNav li.active' has 1 ID (#primaryNav), 1 Class (.active), and 1 Tag (li) -> Specificity (1, 1, 1). Weight hierarchy always prioritizes the ID count."
      },
      {
        id: "css_h2",
        type: "multiple",
        question: "Select all valid CSS Grid property terms:",
        options: [
          "grid-template-columns",
          "grid-gap",
          "justify-self",
          "flex-basis"
        ],
        answer: ["grid-template-columns", "grid-gap", "justify-self"],
        explanation: "grid-template-columns, grid-gap, and justify-self are properties belonging to the CSS Grid Layout. flex-basis belongs to Flexbox."
      },
      {
        id: "css_h3",
        type: "blank",
        question: "To apply style changes smoothly when states transition (e.g. on :hover), we use the CSS property: _______.",
        answer: "transition",
        placeholder: "transition",
        explanation: "The 'transition' property allows you to change property values smoothly (from one value to another), over a given duration."
      }
    ]
  },
  javascript: {
    easy: [
      {
        id: "js_e1",
        type: "single",
        question: "Which of the following is correct to write 'Hello World' on the web page?",
        options: [
          "document.write('Hello World')",
          "document.print('Hello World')",
          "response.write('Hello World')",
          "console.log('Hello World')"
        ],
        answer: "document.write('Hello World')",
        explanation: "document.write() writes directly on the HTML page output. console.log() output goes to the web inspector console."
      },
      {
        id: "js_e2",
        type: "single",
        question: "Which keyword is used to declare a block-scope variable that cannot be reassigned?",
        options: [
          "var",
          "let",
          "const",
          "define"
        ],
        answer: "const",
        explanation: "'const' creates block-scoped variables whose value cannot be changed through re-assignment."
      },
      {
        id: "js_e3",
        type: "multiple",
        question: "Which of the following are primitive datatypes in JavaScript?",
        options: [
          "String",
          "Number",
          "Boolean",
          "Array"
        ],
        answer: ["String", "Number", "Boolean"],
        explanation: "Strings, Numbers, and Booleans are primitive types. Arrays are objects."
      },
      {
        id: "js_e4",
        type: "blank",
        question: "JavaScript is primarily used for _______ web pages.",
        answer: "interactive",
        placeholder: "e.g., interactive",
        altAnswers: ["animating", "dynamic", "making interactive", "interactivity"],
        explanation: "JavaScript adds interactive capabilities, behavioral scripts, or dynamic content to standard static HTML/CSS web pages."
      }
    ],
    medium: [
      {
        id: "js_m1",
        type: "single",
        question: "What is the output of: console.log(typeof NaN);",
        options: [
          "\"number\"",
          "\"NaN\"",
          "\"undefined\"",
          "\"object\""
        ],
        answer: "\"number\"",
        explanation: "In JavaScript, NaN (Not-a-Number) is technically a numeric type, so typeof NaN evaluates to the string 'number'."
      },
      {
        id: "js_m2",
        type: "multiple",
        question: "Which methods can be used to add or remove elements specifically from the END of a JavaScript Array?",
        options: [
          "push()",
          "pop()",
          "shift()",
          "unshift()"
        ],
        answer: ["push()", "pop()"],
        explanation: "push() appends items to the end of an array. pop() removes the last element. shift() and unshift() operate on the front."
      },
      {
        id: "js_m3",
        type: "blank",
        question: "To schedule a function to run exactly once after a specified delay of milliseconds, use the global window method: _______.",
        answer: "setTimeout",
        placeholder: "setTimeout",
        altAnswers: ["window.setTimeout"],
        explanation: "setTimeout() schedules a timer that executes a function or specified piece of code once the timer expires."
      },
      {
        id: "js_m4",
        type: "single",
        question: "How do you check strict equality (equality of both style value and type) in JavaScript?",
        options: [
          "=",
          "==",
          "===",
          "equals()"
        ],
        answer: "===",
        explanation: "The '===' operator checks for strict equality. It compares both values and data types without performing type coercion."
      }
    ],
    hard: [
      {
        id: "js_h1",
        type: "single",
        question: "What is a closure in JavaScript?",
        options: [
          "A way to clear variables from memory",
          "A function that has access to its outer scope variables even after the outer function has returned",
          "The process of surrounding code in brackets to avoid global variable leaks",
          "A strict method of loading third-party scripts securely"
        ],
        answer: "A function that has access to its outer scope variables even after the outer function has returned",
        explanation: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment)."
      },
      {
        id: "js_h2",
        type: "multiple",
        question: "Which statements correctly describe JS Promises and async/await?",
        options: [
          "await expressions can only be used inside async functions",
          "Promise.all() rejects if any of the passed promises reject",
          "Promises can be in three states: pending, fulfilled, or rejected",
          "await blocks the entire main execution thread of the browser tab"
        ],
        answer: ["await expressions can only be used inside async functions", "Promise.all() rejects if any of the passed promises reject", "Promises can be in three states: pending, fulfilled, or rejected"],
        explanation: "Promises are asynchronous and await suspending is non-blocking to browser UI render loops. The rest are completely correct."
      },
      {
        id: "js_h3",
        type: "blank",
        question: "What keyword refers to the current execution context object in Javascript, which varies depending on how a function is called? Key term: _______.",
        answer: "this",
        placeholder: "this",
        explanation: "The 'this' keyword refers to the object that is executing the current bit of JavaScript code."
      }
    ]
  },
  general: {
    easy: [
      {
        id: "gen_e1",
        type: "single",
        question: "Which of the following is an open-source distributed version control system?",
        options: [
          "Git",
          "Subversion",
          "Docker",
          "Node.js"
        ],
        answer: "Git",
        explanation: "Git is a free and open-source distributed version control system designed to handle everything from small to very large projects."
      },
      {
        id: "gen_e2",
        type: "single",
        question: "What standard protocol is used to fetch web pages from servers to client browsers?",
        options: [
          "FTP",
          "SMTP",
          "HTTP",
          "SSH"
        ],
        answer: "HTTP",
        explanation: "HTTP (HyperText Transfer Protocol) is the foundational data protocol used for delivering materials over the web."
      },
      {
        id: "gen_e3",
        type: "multiple",
        question: "Select all valid formats for rendering graphic images and vector icons natively on web pages:",
        options: [
          "SVG",
          "PNG",
          "WEBP",
          "EXE"
        ],
        answer: ["SVG", "PNG", "WEBP"],
        explanation: "SVG is vector-based; PNG and WEBP are modern raster formats. EXE is an executable program binary, not an image format."
      },
      {
        id: "gen_e4",
        type: "blank",
        question: "The standard format for data exchange on the web, structured with key-value pairs and easily readable by human and machine, is abbreviated as: _______.",
        answer: "JSON",
        placeholder: "JSON",
        altAnswers: ["json"],
        explanation: "JSON (JavaScript Object Notation) is a lightweight format for storing and transporting structured data."
      }
    ],
    medium: [
      {
        id: "gen_m1",
        type: "single",
        question: "Which database type uses tables, grids, rows, and structured queries (SQL)?",
        options: [
          "NoSQL Key-Value store",
          "Document database",
          "Relational Database Management System (RDBMS)",
          "Graph Database"
        ],
        answer: "Relational Database Management System (RDBMS)",
        explanation: "RDBMS databases organize data into formal tables (grids, rows, columns, relational models) queried using SQL."
      },
      {
        id: "gen_m2",
        type: "multiple",
        question: "Which of the following are valid status code groups and their standard definitions?",
        options: [
          "2xx indicates Success",
          "4xx indicates Client Error",
          "5xx indicates Server Error",
          "3xx indicates Severe Security Breach"
        ],
        answer: ["2xx indicates Success", "4xx indicates Client Error", "5xx indicates Server Error"],
        explanation: "3xx is used for Redirection (e.g., Moved Permanently, Found). 2xx, 4xx, and 5xx represent Success, Client Error, and Server Error respectively."
      },
      {
        id: "gen_m3",
        type: "blank",
        question: "An API architectural style that relies on stateless communication, utilizes HTTP verbs (GET, POST, PUT, DELETE), and handles resources is called: _______.",
        answer: "REST",
        placeholder: "REST",
        altAnswers: ["Representational State Transfer", "Restful"],
        explanation: "REST (Representational State Transfer) is an architectural style for designing networked web integrations."
      },
      {
        id: "gen_m4",
        type: "single",
        question: "What is the default port number used for secure HTTPS connections?",
        options: [
          "80",
          "443",
          "8080",
          "3000"
        ],
        answer: "443",
        explanation: "Port 443 is the standard port for secure HTTPS/TLS traffic. Standard unsecured HTTP uses port 80."
      }
    ],
    hard: [
      {
        id: "gen_h1",
        type: "single",
        question: "What is the primary purpose of a 'Content Security Policy' (CSP) header in web communications?",
        options: [
          "To speed up CSS styling assets loaded from secondary CDNs",
          "To mitigate Cross-Site Scripting (XSS) and data injection attacks by restricting allowed resource locations",
          "To log all clicks and scrolls completed on public interactive websites",
          "To enforce absolute password rotation rules for database administrative users"
        ],
        answer: "To mitigate Cross-Site Scripting (XSS) and data injection attacks by restricting allowed resource locations",
        explanation: "CSP headers allow site administrators to declare which dynamic resources are authorized to load and execute on their page, preventing security breaches like XSS."
      },
      {
        id: "gen_h2",
        type: "multiple",
        question: "Select all valid browser optimization and caching strategies:",
        options: [
          "Bundling and minifying CSS/JavaScript assets",
          "Using Cache-Control headers to cache static assets",
          "Lazy loading off-screen images",
          "Executing synchronous XHR requests on the main thread"
        ],
        answer: ["Bundling and minifying CSS/JavaScript assets", "Using Cache-Control headers to cache static assets", "Lazy loading off-screen images"],
        explanation: "Asset bundle minification, local Cache-Control guidelines, and lazy image loading are positive performance habits. Synchronous main-thread XHR is block-vulnerable and deprecated."
      },
      {
        id: "gen_h3",
        type: "blank",
        question: "What does DOM stand for in Web Development? Character sequence: _______.",
        answer: "Document Object Model",
        placeholder: "Document Object Model",
        explanation: "The Document Object Model (DOM) is a programming interface for web HTML and XML documents, representing the page structure as a tree of objects."
      }
    ]
  }
};
