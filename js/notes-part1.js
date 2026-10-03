const NOTES = [];

NOTES.push({
  num: "00",
  title: "Setup & Tooling",
  intro: "TypeScript likhne, compile karne, aur project setup karne ka complete base. Browser mein TS seedha nahi chalta — pehle JavaScript banta hai. Is module ka goal: tools ka matlab samajhna, sirf commands rato mat.",
  topics: [
    {
      id: "m0-what",
      title: "TypeScript kya hai?",
      body: `
        <div class="def"><strong>Definition</strong>
        TypeScript ek programming language hai jo JavaScript ka <em>typed superset</em> hai. Matlab: JavaScript ke saare features usme hain, plus compile-time type checking. Source file <code>.ts</code> / <code>.tsx</code> hoti hai; run time pe converted <code>.js</code> chalti hai.
        </div>
        <p class="why"><strong>Simple words:</strong> TS teacher jaisa hai jo code run hone se pehle kehta hai “yeh number hai, string mat bhejo”. Browser yeh teacher nahi hai — sirf JS padhta hai.</p>
        <p><strong>Superset ka matlab:</strong> almost har valid JS file ko TS file bana sakte ho. Extra cheez types hain: <code>string</code>, <code>interface</code>, <code>generic</code>, wagairah. Compiler (<code>tsc</code>) types check karta hai, phir unhe hata kar JS nikalta hai. Isi ko <strong>type erasure</strong> kehte hain.</p>
        <p><strong>Static typing:</strong> types code likhte waqt / compile pe check. Dynamic typing (plain JS) mein galti aksar tab pata chalti hai jab program chal raha ho. Bade college projects aur internships mein static types se refactoring safe hoti hai, autocomplete better milta hai, team ko function ka contract dikhta hai.</p>
        <p><strong>Kyun padhein (CSE):</strong> React, Angular, NestJS, Node APIs — industry default TS hai. Interview mein “JS vs TS” almost guaranteed sawaal hai.</p>
        <div class="note"><strong>Yaad rakho:</strong> Types documentation + safety hain, runtime validation nahi. Galat JSON API se aa sakti hai chahe type <code>User</code> likha ho — baad mein Module 11.</div>
        <pre><code>// greet.ts
function greet(name: string): string {
  return "Hello, " + name;
}

greet("Aman");
// greet(10); // Error: Argument of type 'number' is not assignable to parameter of type 'string'</code></pre>
        <p>Upar <code>name: string</code> parameter ka type hai, <code>: string</code> function ke baad return type hai. <code>greet(10)</code> compile pe fail — run pe jaane se pehle pakda.</p>
      `
    },
    {
      id: "m0-install",
      title: "Node, npm, TypeScript install",
      body: `
        <div class="def"><strong>Definition</strong>
        <code>Node.js</code> JavaScript ko computer (server/CLI) pe chalane ka runtime hai. <code>npm</code> packages install karne ka package manager hai. TypeScript khud ek npm package hai jisme compiler <code>tsc</code> aata hai.
        </div>
        <p class="why">TS browser mein seedha execute nahi hota, isliye pehle Node + compiler chahiye. <code>-D</code> (devDependency) isliye kyunki production server pe aksar compiled JS hi chalti hai, compiler nahi.</p>
        <p><strong>Local vs global:</strong> Global install (<code>-g</code>) har jagah same <code>tsc</code>. Local install project ke <code>node_modules</code> mein rehti hai — version <code>package.json</code> mein lock. College projects / GitHub pe local better: doston ke machine pe same compiler.</p>
        <p><code>npx tsc</code> local wala compiler chalata hai, PATH mein global hone ki zaroorat nahi.</p>
        <ol>
          <li>Node.js LTS install — saath npm aata hai.</li>
          <li>Check: <code>node -v</code>, <code>npm -v</code>.</li>
          <li>Folder: <code>npm init -y</code> se <code>package.json</code>.</li>
          <li><code>npm install -D typescript</code></li>
          <li><code>npx tsc --version</code></li>
        </ol>
        <table>
          <tr><th>Command</th><th>Definition / kaam</th></tr>
          <tr><td><code>npx tsc app.ts</code></td><td>Ek file compile karke usi folder mein JS</td></tr>
          <tr><td><code>npx tsc</code></td><td>poora project <code>tsconfig.json</code> se</td></tr>
          <tr><td><code>npx tsc --watch</code></td><td>save pe dubara compile (dev)</td></tr>
          <tr><td><code>npx tsc --noEmit</code></td><td>sirf errors dikhao, JS mat likho (CI / Vite projects)</td></tr>
        </table>
      `
    },
    {
      id: "m0-tsconfig",
      title: "tsconfig.json basics",
      body: `
        <div class="def"><strong>Definition</strong>
        <code>tsconfig.json</code> TypeScript compiler ki configuration file hai. Yeh batati hai: kaunsi files, kaunsa JS version, types kitne strict, output kahan.
        </div>
        <p class="why">Bina iske <code>tsc</code> har file alag treat karta hai. Config se project ek unit ban jaata hai — yahi “TS project” ki definition hai.</p>
        <p><code>npx tsc --init</code> sample file banata hai. <code>compilerOptions</code> andar flags. <code>include</code> whitelist, <code>exclude</code> skip (jaise <code>node_modules</code>).</p>
        <p><code>strict: true</code> beginner ke liye thoda “daantne wala” lagta hai, lekin yahi asli TypeScript seekhne ka mode hai. Iske bina kayi bugs silent reh jaate hain.</p>
        <pre><code>{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "rootDir": "src",
    "outDir": "dist",
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}</code></pre>
        <ul>
          <li><code>target</code>: output JS ka edition. Purana browser = neeche target (ES5). Node 18+ = ES2020 theek.</li>
          <li><code>module</code>: <code>import</code>/<code>export</code> ka output style — CommonJS (<code>require</code>) ya ES modules.</li>
          <li><code>rootDir</code> / <code>outDir</code>: source tree mirror karke <code>dist</code> mein JS.</li>
        </ul>
      `
    },
    {
      id: "m0-workflow",
      title: "Compile workflow, watch, source maps",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Compile workflow</strong> woh steps hain: TypeScript likho → <code>tsc</code> type-check + JS emit → Node/browser JS chalao. <strong>Watch mode</strong> file change pe yeh loop automatic. <strong>Source map</strong> ek map file (<code>.js.map</code>) hai jo compiled line ko original TS line se jodti hai debugging ke liye.
        </div>
        <p>Professional folder aksar <code>src</code> (tumhara code) aur <code>dist</code> (generated, git ignore) alag rakhti hai. <code>package.json</code> scripts: <code>"build": "tsc"</code>, <code>"start": "node dist/index.js"</code>.</p>
        <p><strong>Language service:</strong> VS Code/Cursor ke andar wahi TypeScript engine errors red line se dikhata hai, compile kiye bina. <code>// @ts-check</code> JS file mein limited checking — migration ke kaam aata hai.</p>
        <pre><code>project/
  src/index.ts
  dist/index.js
  tsconfig.json
  package.json</code></pre>
        <div class="tip"><strong>Student habit:</strong> error aaye to pehle type padho, <code>any</code> se mute mat karo. <code>any</code> compiler ko andha bana deta hai.</div>
      `
    }
  ]
});

NOTES.push({
  num: "01",
  title: "JavaScript refresh (TS ke liye)",
  intro: "TypeScript JavaScript ko replace nahi karta — uske upar types rakhta hai. JS weak ho to TS ke errors samajh nahi aayenge. Yeh module definitions + wo JS pieces jo TS mein roz aate hain.",
  topics: [
    {
      id: "m1-letconst",
      title: "let, const, scope",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Scope</strong> woh area hai jahan variable visible hai. <code>let</code> aur <code>const</code> <em>block scope</em> (curly braces <code>{}</code> ke andar) follow karte hain. <code>const</code> binding reassign nahi hoti. <code>var</code> function-scope + hoisting — modern TS/JS mein avoid.
        </div>
        <p class="why"><code>const</code> ka matlab object freeze nahi. Binding constant hai: <code>user = dusra</code> nahi, lekin <code>user.name</code> change ho sakta hai. TS mein bhi yahi rule; <code>readonly</code> alag cheez hai (properties ke liye).</p>
        <p>Block ke bahar <code>let</code> use karoge to ReferenceError. Yeh TS ko bhi help karta hai: variable exist hi nahi to type nahi.</p>
        <pre><code>const user = { name: "Riya" };
user.name = "Aman"; // OK — property change
// user = {}; // Error — binding change

if (true) {
  let score = 10;
}
// score yahan exist nahi (block scope)</code></pre>
      `
    },
    {
      id: "m1-fn",
      title: "Functions, arrow functions, this",
      body: `
        <div class="def"><strong>Definition</strong>
        Function reusable code block hai jo input (parameters) le sakta hai aur output (return) de sakta hai. <strong>Arrow function</strong> (<code>=></code>) short syntax hai. <code>this</code> current execution context hai — object method mein aksar woh object, arrow mein surrounding lexical scope.
        </div>
        <p>TS function types isi JS model pe chalti hain. Galat <code>this</code> se TS error tab aata hai jab <code>this</code> parameter type likha ho (Module 4). Methods (object ke andar behaviour) ke liye regular function / method syntax safer, kyunki <code>this</code> call site se bind hota hai.</p>
        <p>Arrow callbacks (<code>map</code>, <code>forEach</code>) mein <code>this</code> ko class field ki taraf rakhne ke liye useful hai.</p>
        <pre><code>function add(a, b) { return a + b; }
const add2 = (a, b) => a + b;

const obj = {
  n: 1,
  regular() { return this.n; },
  arrow: () => this // window/undefined — obj nahi
};</code></pre>
      `
    },
    {
      id: "m1-objarr",
      title: "Objects, arrays, destructuring, spread",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Object</strong> key-value pairs ka collection. <strong>Array</strong> ordered list. <strong>Destructuring</strong> object/array se variables nikaalna. <strong>Spread</strong> (<code>...</code>) elements/properties ko expand karke copy/merge. <strong>Rest</strong> bache hue values ko array/object mein collect.
        </div>
        <p>Spread <em>shallow copy</em> hai: top-level nayi list/object, nested objects same reference. Isliye nested state copy karte waqt galat bug aata hai — TS yeh runtime bug nahi rokta, sirf types.</p>
        <p>TS interfaces inhi objects ki <em>shape</em> describe karte hain. Destructuring ke baad bhi types annotate ho sakte hain: <code>const { name }: { name: string } = student</code>.</p>
        <pre><code>const nums = [1, 2, 3];
const copy = [...nums, 4];

const student = { name: "Dev", year: 2 };
const { name, year } = student;
const extra = { ...student, city: "Pune" };

function sum(...rest) {
  return rest.reduce((a, b) => a + b, 0);
}</code></pre>
      `
    },
    {
      id: "m1-modules",
      title: "Modules: import / export",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Module</strong> ek file hai jo apna scope rakhti hai. <code>export</code> dusri files ko cheez share. <code>import</code> use. <strong>Named export</strong> naam se; <strong>default export</strong> file ki “main” cheez (ek hi default).
        </div>
        <p>Purane scripts global variables pollute karte the. Modules se naam clash kam. TS har <code>.ts</code> file ko module maanta hai agar import/export hai (warna script/global — <code>export {}</code> se module banao).</p>
        <p>Path extension (<code>.js</code> vs <code>.ts</code>) <code>moduleResolution</code> pe depend. Bundler projects mein aksar extension skip. Node16/nodenext mein kabhi <code>.js</code> extension TS source mein likhni padti hai (emit ke hisaab se).</p>
        <pre><code>// math.ts
export const PI = 3.14;
export function area(r) { return PI * r * r; }
export default function hello() { return "hi"; }

// app.ts
import hello, { PI, area } from "./math";</code></pre>
      `
    },
    {
      id: "m1-async",
      title: "Callbacks, Promises, async/await",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Callback</strong> function jo baad mein call ho (async kaam complete hone par). <strong>Promise</strong> object jo future value represent karta hai: pending / fulfilled / rejected. <code>async/await</code> Promises ko synchronous-looking syntax dena; <code>await</code> Promise resolve hone tak rukta hai.
        </div>
        <p>Network, file, timer — JS single thread pe block nahi karna chahta, isliye async. TS mein <code>Promise&lt;User&gt;</code> ka matlab: “baad mein User milega”. Galat typing se <code>.then</code> ke andar <code>any</code> ban jaata hai — phir safety khatam.</p>
        <p><code>await</code> sirf <code>async</code> function ya ES module top-level pe. Errors Promise reject / throw se aate hain — <code>try/catch</code> ya <code>.catch</code>.</p>
        <pre><code>fetch("/api/user")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

async function load() {
  try {
    const res = await fetch("/api/user");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}</code></pre>
      `
    }
  ]
});

NOTES.push({
  num: "02",
  title: "Core Types",
  intro: "Type ki definition: compile time pe value ke allowed set ka description. JS runtime pe types nahi enforce karta is tarah; TS compiler karta hai. Yeh module poora TS ka foundation hai — definitions yahan ratna nahi, examples se feel aani chahiye.",
  topics: [
    {
      id: "m2-primitives",
      title: "Primitive types",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Primitive type</strong> woh built-in simple types hain jo objects nahi: <code>string</code>, <code>number</code>, <code>boolean</code>, <code>bigint</code>, <code>symbol</code>, <code>null</code>, <code>undefined</code>. <strong>Type annotation</strong> colon syntax hai: <code>let x: number = 5</code> — variable <code>x</code> sirf number values le sakta hai.
        </div>
        <p>JavaScript mein <code>typeof null === "object"</code> historic bug hai; TS mein <code>null</code> alag type. <code>number</code> integers aur floats dono cover karta hai (IEEE floats) — alag <code>int</code> type nahi.</p>
        <p><code>undefined</code> = value assign nahi hui / missing. <code>null</code> = intentional empty. <code>strictNullChecks</code> ON ho to inhe <code>string</code> ke andar silently mix nahi kar sakte — yeh feature hai, nuisance nahi.</p>
        <table>
          <tr><th>Type</th><th>Definition (short)</th><th>Example</th></tr>
          <tr><td><code>string</code></td><td>text</td><td><code>"hi"</code></td></tr>
          <tr><td><code>number</code></td><td>numeric value</td><td><code>10</code>, <code>3.14</code></td></tr>
          <tr><td><code>boolean</code></td><td>true/false</td><td><code>true</code></td></tr>
          <tr><td><code>bigint</code></td><td>arbitrary size integer</td><td><code>10n</code></td></tr>
          <tr><td><code>symbol</code></td><td>unique identifier</td><td><code>Symbol("id")</code></td></tr>
        </table>
        <pre><code>let title: string = "Notes";
let marks: number = 87;
let pass: boolean = true;</code></pre>
      `
    },
    {
      id: "m2-infer",
      title: "Type inference vs explicit annotation",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Type inference</strong> compiler ka andaza: value dekh kar type nikalna. <strong>Explicit annotation</strong> programmer khud type likhe. Dono sahi ho sakte hain; inference default, annotation jab compiler guess wide/galat ho ya public API document karni ho.
        </div>
        <p><code>let city = "Delhi"</code> → TS <code>string</code> maanta hai, <code>"Delhi"</code> literal nahi (let variables widen). <code>const city = "Delhi"</code> aksar literal type <code>"Delhi"</code> — kyunki reassign nahi.</p>
        <p>Functions: parameters generally explicit (inference nahi ho sakti bina default/context). Return type infer ho sakta hai; public library functions pe return type likhna documentation + accidental change rokna hai.</p>
        <pre><code>let city = "Delhi"; // inferred string
let city2: string = "Delhi"; // explicit — yahan optional

function id(x: number) {
  return x; // return inferred number
}</code></pre>
      `
    },
    {
      id: "m2-any-unknown",
      title: "any, unknown, never, void",
      body: `
        <div class="def"><strong>Definition</strong>
        <code>any</code> = type system off is value ke liye; koi bhi operation allowed. <code>unknown</code> = value ka type pata nahi, lekin use se pehle check zaroori (safe unknown). <code>void</code> = function useful value return nahi karta (undefined return typical). <code>never</code> = woh type jisme koi value nahi bas sakti — function return hi nahi karta, ya code branch impossible hai.
        </div>
        <p><code>any</code> JS migration aur “jaldi kaam” ke liye tempting hai. Price: autocomplete khatam, galat property silently. Team rule aksar: <code>no-explicit-any</code>.</p>
        <p><code>JSON.parse</code> ka return default <code>any</code> tha purane lib mein; socho <code>unknown</code> — phir guard. <code>never</code> switch ke default mein: agar saare cases handle, TS khush; naya union member add ho to error — exhaustiveness.</p>
        <pre><code>function log(msg: string): void {
  console.log(msg);
}

function fail(message: string): never {
  throw new Error(message);
}

function parse(json: string): unknown {
  return JSON.parse(json);
}

const data = parse('{"a":1}');
if (typeof data === "object" && data && "a" in data) {
  // ab use
}</code></pre>
        <div class="warn">Unknown data = <code>unknown</code> + check. <code>any</code> last option.</div>
      `
    },
    {
      id: "m2-arrays-tuples",
      title: "Arrays aur tuples",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Array type</strong> <code>T[]</code> ya <code>Array&lt;T&gt;</code>: kisi bhi length ki list, har element type <code>T</code>. <strong>Tuple</strong> fixed (ya known) length ka array jahan <em>index ka type alag</em> ho sakta hai, jaise <code>[string, number]</code> = pehla naam, doosra umar.
        </div>
        <p>Array tab jab “kitne bhi scores”. Tuple tab jab position ka meaning ho: CSV row, key-value pair, React <code>useState</code> return <code>[value, setter]</code>.</p>
        <p>Optional tuple element <code>?</code>, rest tuple <code>...T[]</code>. Labels bhi: <code>[name: string, age: number]</code> — sirf documentation, runtime nahi.</p>
        <pre><code>let scores: number[] = [10, 20];
let scores2: Array&lt;number&gt; = [10, 20];

let row: [string, number] = ["Aman", 21];
row[0].toUpperCase();
row[1].toFixed(0);

let optionalTuple: [string, number?] = ["ok"];
let restTuple: [string, ...number[]] = ["id", 1, 2, 3];</code></pre>
      `
    },
    {
      id: "m2-enums",
      title: "Enums vs union literals",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Enum</strong> named constant set (TS feature). Numeric enum 0,1,2... assign karta hai unless value do. <strong>String union</strong> (<code>"admin" | "student"</code>) enum ka lightweight alternative — sirf types, chhota runtime.
        </div>
        <p>Numeric enums reverse mapping bhi generate karte hain (JS object). Kabhi bundle size / tree-shaking issue. Isliye kai style guides: enums mat use, unions use.</p>
        <p><code>const enum</code> compile pe inline; <code>isolatedModules</code> (Vite) ke saath problem ho sakti hai. Students: pehle union literals seekho, enum tab jab course/syllabus maange.</p>
        <pre><code>enum Role {
  Admin,
  Student,
  Guest
}
const r: Role = Role.Student;

type Role2 = "admin" | "student" | "guest";
const r2: Role2 = "admin";</code></pre>
      `
    },
    {
      id: "m2-literals-union",
      title: "Literal types, union, intersection",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Literal type</strong> ek specific value ka type, jaise <code>"dark"</code> na ki koi bhi string. <strong>Union</strong> (<code>A | B</code>) value A ya B ho sakti hai. <strong>Intersection</strong> (<code>A &amp; B</code>) value mein A aur B dono ki properties/constraints ek saath.
        </div>
        <p>Union “ya to”: function string ya number dono le. Use se pehle narrowing. Intersection objects pe “merge shapes”: <code>{name} &amp; {age}</code> = dono fields required.</p>
        <p>Primitive intersection jaise <code>string &amp; number</code> almost <code>never</code> (koi value dono nahi). Branded types is trick ko jaan-bujh kar use karti hain (Module 7).</p>
        <pre><code>type Mode = "light" | "dark";
let theme: Mode = "dark";

function pad(value: string | number) {
  return String(value).padStart(3, "0");
}

type A = { name: string };
type B = { age: number };
type C = A &amp; B;
const person: C = { name: "Ira", age: 19 };</code></pre>
      `
    },
    {
      id: "m2-narrowing",
      title: "Type narrowing",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Narrowing</strong> control-flow se union type ko chhote, specific type mein badalna. Compiler if/switch/typeof dekh kar block ke andar tighter type maan leta hai.
        </div>
        <p>Bina narrowing ke union pe .toUpperCase nahi chala sakte — number pe method nahi. Yeh TS ka daily pattern hai: pehle check, phir use.</p>
        <p>Tools: <code>typeof</code> primitives, <code>instanceof</code> classes, <code>in</code> property existence, truthiness (<code>if (x)</code> null hatao), equality, custom type guards (<code>is</code>).</p>
        <pre><code>function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(0));
  }
}

function demo(x: Date | string) {
  if (x instanceof Date) x.getFullYear();
}

type Fish = { swim: () => void };
type Bird = { fly: () => void };
function move(a: Fish | Bird) {
  if ("swim" in a) a.swim();
  else a.fly();
}

function live(x: string | null) {
  if (!x) return;
  console.log(x.length);
}</code></pre>
      `
    },
    {
      id: "m2-assert",
      title: "Type assertions aur non-null",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Type assertion</strong> (<code>as T</code> ya angle-bracket, JSX mein avoid) compiler ko kehta hai “is value ko T maano”. Runtime check zero. <strong>Non-null assertion</strong> <code>!</code> kehta hai value <code>null</code>/<code>undefined</code> nahi.
        </div>
        <p>DOM: <code>getElementById</code> <code>HTMLElement | null</code> return. Tumhe pata hai ID exist karti hai to <code>as HTMLDivElement</code> — lekin galat ID pe crash. Better: <code>if (el)</code> se narrow.</p>
        <p>Assertion double (<code>as unknown as T</code>) almost <code>any</code> jaisa dangerous. API JSON pe assertion = jhooth bolna compiler se.</p>
        <pre><code>const el = document.getElementById("app") as HTMLDivElement;
const el2 = document.querySelector(".box")!; // non-null assertion</code></pre>
        <div class="warn">Assertion ≠ conversion. <code>as string</code> number ko string nahi banata runtime pe.</div>
      `
    }
  ]
});

NOTES.push({
  num: "03",
  title: "Objects, interface, type alias",
  intro: "Object type ki definition: keys aur unke value types ka contract. Real apps mein 80% types objects hi hote hain — User, Product, Request body.",
  topics: [
    {
      id: "m3-object",
      title: "Object types, optional, readonly",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Object type</strong> properties ki list + har property ka type. <code>?</code> <strong>optional property</strong>: ho sakti hai missing. <code>readonly</code> assignment baad mein mana (compile time); object freeze nahi karta runtime pe unless <code>Object.freeze</code>.
        </div>
        <p>Optional ka use: form fields, PATCH APIs, config. Missing property vs explicitly <code>undefined</code> — <code>exactOptionalPropertyTypes</code> flag se farq strict hota hai; beginner pehle simple samjho: <code>?</code> matlab “na bhi ho to chalega”.</p>
        <p><code>readonly</code> IDs, constants ke liye. Nested objects ke andar alag se readonly chahiye to nested type pe bhi lagao ya <code>Readonly&lt;T&gt;</code>.</p>
        <pre><code>type User = {
  readonly id: number;
  name: string;
  email?: string;
};

const u: User = { id: 1, name: "Sam" };
// u.id = 2; // Error
u.name = "Alex"; // OK</code></pre>
      `
    },
    {
      id: "m3-index",
      title: "Index signatures",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Index signature</strong> batata hai: is object ki keys ka pattern kya hai jab saari keys pehle se naam se na likhi hon. Example: <code>{ [key: string]: number }</code> = koi bhi string key, value number.
        </div>
        <p>Maps, dictionaries, JSON jisme keys dynamic hon. Problem: typon se bhi string key valid — <code>marks.maths</code> vs <code>marks.math</code> dono number | (flag ke hisaab se). Isliye known keys ho to unhe explicitly likho, index last resort.</p>
        <p>Rule: explicit property ka type index signature ke type ke compatible hona chahiye. <code>id: number</code> ke saath index <code>string</code> nahi — isliye <code>string | number</code>.</p>
        <pre><code>type Dict = {
  [key: string]: number;
};
const marks: Dict = { maths: 90, ds: 88 };

type Mixed = {
  id: number;
  [extra: string]: string | number;
};</code></pre>
      `
    },
    {
      id: "m3-iface-type",
      title: "interface vs type",
      body: `
        <div class="def"><strong>Definition</strong>
        <code>interface</code> object (aur class) ki shape declare karne ka keyword; extend aur declaration merging support. <code>type</code> (type alias) kisi bhi type ko naam dena — union, tuple, primitives, mapped types bhi.
        </div>
        <p>Dono se <code>{ name: string }</code> likh sakte ho. Farq features mein hai, speed/runtime mein nahi (dono erase). Interview mein yahi table expected hai.</p>
        <p>Public library object contracts: interface (merge se users extra fields add kar sakte hain). Unions: type. Mixed team: ek style choose, mix random mat karo.</p>
        <table>
          <tr><th></th><th>interface</th><th>type</th></tr>
          <tr><td>Object shape</td><td>haan</td><td>haan</td></tr>
          <tr><td>Union / primitives</td><td>direct nahi</td><td>haan</td></tr>
          <tr><td>Extend</td><td><code>extends</code></td><td><code>&amp;</code></td></tr>
          <tr><td>Declaration merging</td><td>haan</td><td>nahi</td></tr>
        </table>
        <pre><code>interface Animal { name: string; }
interface Dog extends Animal { bark(): void; }

type ID = string | number;
type Cat = Animal &amp; { meow(): void };</code></pre>
      `
    },
    {
      id: "m3-merge-excess",
      title: "Declaration merging aur excess property check",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Declaration merging:</strong> same naam ke interfaces compiler jod deta hai — saari properties ek type. <strong>Excess property check:</strong> object <em>literal</em> extra unknown fields pe error, taaki typos pakde (jaise <code>colour</code> vs <code>color</code>).
        </div>
        <p>Merging libraries ke <code>.d.ts</code> mein common (global <code>Window</code> extra fields). Apne app code mein same naam do baar interface galti se merge — confusing. Types merge nahi hote, error aata hai duplicate type pe.</p>
        <p><strong>Structural typing:</strong> TS naam nahi, shape dekhta hai. Variable extra fields ke saath pass ho sakta hai agar required fields match. Literal pe extra field error isliye taaki “fresh” object mein typo na chhoot jaaye.</p>
        <pre><code>interface Box { w: number; }
interface Box { h: number; }
const b: Box = { w: 1, h: 2 };

function draw(circle: { r: number }) {}
draw({ r: 5 });
// draw({ r: 5, color: "red" }); // excess property error

const extra = { r: 5, color: "red" };
draw(extra); // OK — structural</code></pre>
      `
    }
  ]
});

NOTES.push({
  num: "04",
  title: "Functions",
  intro: "Function type ki definition: parameters ke types + return type (+ optional this). JS mein functions first-class hain; TS unhe contract deta hai taaki galat callback na lag jaaye.",
  topics: [
    {
      id: "m4-params",
      title: "Parameter, return, optional, default, rest",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Parameter type</strong> input ka contract. <strong>Return type</strong> output ka. <strong>Optional parameter</strong> <code>?</code> — skip ho sakta hai (value <code>undefined</code>). <strong>Default parameter</strong> value auto milti hai. <strong>Rest parameter</strong> <code>...name</code> bache arguments ko array.
        </div>
        <p>Required ke baad optional allowed; optional ke baad required nahi (confusion). Default wale optional jaise behave. Return type nahi likho to infer; <code>undefined</code> return vs <code>void</code> thoda alag — void matlab caller value ignore kare.</p>
        <pre><code>function greet(name: string, title?: string): string {
  return title ? title + " " + name : name;
}

function pow(base: number, exp = 2): number {
  return base ** exp;
}

function total(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}</code></pre>
      `
    },
    {
      id: "m4-fn-types",
      title: "Function type expressions aur call signatures",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Function type expression</strong> <code>(n: number) =&gt; string</code> — “yeh shape ka function”. <strong>Call signature</strong> object type ke andar <code>(q: string): string[]</code> — function jo extra properties bhi rakh sakta hai (callable object).
        </div>
        <p>Callbacks, event handlers, strategy pattern — function types se galat arity/return pakda jaata hai. Higher-order functions (<code>map</code>) generic function types use karti hain.</p>
        <pre><code>type Mapper = (n: number) => string;
const m: Mapper = (n) => String(n);

type SearchFn = {
  (q: string): string[];
  count: number;
};</code></pre>
      `
    },
    {
      id: "m4-overloads",
      title: "Function overloads",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Overload</strong> ek function ke kai public type signatures. Implementation ek hi body. Caller ko us case ka precise return type milta hai, ek bada union nahi.
        </div>
        <p>Upar ki lines sirf types (emit nahi). Last line implementation — often wider params. Callers implementation signature nahi dekhte, sirf overloads.</p>
        <p>Zyada overloads maintain karna mushkil. Kabhi discriminated union argument better. Phir bhi DOM APIs aur date helpers mein overloads common.</p>
        <pre><code>function makeDate(timestamp: number): Date;
function makeDate(y: number, m: number, d: number): Date;
function makeDate(y: number, m?: number, d?: number): Date {
  if (m !== undefined && d !== undefined) return new Date(y, m, d);
  return new Date(y);
}</code></pre>
      `
    },
    {
      id: "m4-this-cb",
      title: "this typing aur callbacks",
      body: `
        <div class="def"><strong>Definition</strong>
        Function ke pehle parameter ke naam se <code>this</code> likhna <em>fake parameter</em> hai — runtime argument nahi, sirf type. Yeh bataata hai method kis object pe call hogi. Callback type alag se define karke galat handler assign hone se rokta hai.
        </div>
        <p>Class methods ko alag se pass karo to <code>this</code> toot sakta hai — <code>.bind</code> ya arrow class field. DOM: <code>this</code> element ho sakta hai. TS ko batao warna <code>any</code>/<code>unknown</code> context.</p>
        <pre><code>const user = {
  id: 1,
  getId(this: { id: number }) {
    return this.id;
  }
};

type Click = (this: HTMLButtonElement, ev: MouseEvent) => void;</code></pre>
      `
    }
  ]
});
