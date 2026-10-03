NOTES.push({
  num: "10",
  title: "Async typing & errors",
  intro: "Async ka matlab kaam abhi complete nahi. TypeScript is future value ko <code>Promise&lt;T&gt;</code> se describe karta hai. Error typing alag discipline hai — JS mein koi bhi throw ho sakta hai.",
  topics: [
    {
      id: "m10-promise",
      title: "Promise aur async function types",
      body: `
        <div class="def"><strong>Definition</strong>
        <code>Promise&lt;T&gt;</code> aisi computation jo baad mein type T ki value resolve karegi (ya reject). <code>async function</code> hamesha Promise return karti hai — even if tum <code>return 5</code> likho, type <code>Promise&lt;number&gt;</code> banega.
        </div>
        <p><code>fetch</code> ka <code>.json()</code> default mein loosely typed ho sakta hai. Isliye generic helper ya schema. <code>await</code> Promise unwrap karta hai: <code>Promise&lt;User&gt;</code> se <code>User</code> (ya throw).</p>
        <p>Parallel: <code>Promise.all</code> tuple types preserve kar sakta hai. Race/any alag semantics — types union/widen ho sakte hain.</p>
        <pre><code>function loadUser(id: string): Promise&lt;{ name: string }&gt; {
  return fetch("/u/" + id).then((r) => r.json());
}

async function loadUser2(id: string) {
  const r = await fetch("/u/" + id);
  return r.json() as Promise&lt;{ name: string }&gt;;
}</code></pre>
        <p>Note: last line assertion still unsafe; production mein parse. Yahan sirf Promise wrapping dikhane ke liye hai.</p>
      `
    },
    {
      id: "m10-catch",
      title: "catch mein unknown, Result pattern",
      body: `
        <div class="def"><strong>Definition</strong>
        <code>catch (e)</code> mein <code>e</code> theoretically kuch bhi: Error, string, number. Isliye strict TS mein type <code>unknown</code>. <strong>Result pattern</strong> throw ki jagah return value: success ya failure object (discriminated union) — errors data ban jaate hain, types mein dikhte hain.
        </div>
        <p><code>e as any</code> catch mein mat. <code>instanceof Error</code> common; kuch libraries custom error classes. Result pattern functional style: caller if/else, try/catch kam. Dono mix mat karo randomly ek function mein.</p>
        <pre><code>try {
  await loadUser("1");
} catch (e: unknown) {
  if (e instanceof Error) console.log(e.message);
  else console.log(String(e));
}

type Result&lt;T&gt; =
  | { ok: true; value: T }
  | { ok: false; error: string };

function parseNum(s: string): Result&lt;number&gt; {
  const n = Number(s);
  if (Number.isNaN(n)) return { ok: false, error: "NaN" };
  return { ok: true, value: n };
}</code></pre>
      `
    }
  ]
});

NOTES.push({
  num: "11",
  title: "Runtime vs types (validation)",
  intro: "Sabse important mental model: TypeScript compiler duniya ka policeman nahi, sirf tumhare source ka. Bahar se aaya data untyped hai jab tak check na ho.",
  topics: [
    {
      id: "m11-erase",
      title: "Type erasure",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Type erasure</strong> compile ke dauran types (interfaces, type aliases, generics, annotations) hata dena. Output JavaScript mein woh exist nahi karte. Isliye <code>instanceof MyInterface</code> illegal/impossible — interface runtime value nahi.
        </div>
        <p>Enums (numeric) exception jaisi: JS object reh sakta hai. <code>class</code> runtime rehti hai. Baaki “paper contract” hai. Interview one-liner: “types are removed before the code runs.”</p>
        <pre><code>interface User { name: string }
function f(u: User) { return u.name; }
// compiled JS roughly: function f(u) { return u.name; }</code></pre>
      `
    },
    {
      id: "m11-zod",
      title: "Safe parse: JSON + Zod idea",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Validation / parsing</strong> runtime pe unknown data ko schema se check karke typed value banana. Zod (ya similar) schema library hai: ek schema se TypeScript type infer (<code>z.infer</code>) + parse/safeParse.
        </div>
        <p><strong>Trust boundary:</strong> HTTP, localStorage, query string, CLI args, file JSON. Andar ke functions typed maango; boundary pe parse. <code>JSON.parse</code> return unknown treat karo.</p>
        <p><code>parse</code> fail pe throw. <code>safeParse</code> Result-like. Bina library: nested type guards — lamba, error-prone, seekhne ke liye theek.</p>
        <pre><code>import { z } from "zod";
const User = z.object({
  id: z.number(),
  name: z.string()
});
type User = z.infer&lt;typeof User&gt;;

const json: unknown = JSON.parse(text);
const user = User.parse(json);
const maybe = User.safeParse(json);</code></pre>
      `
    },
    {
      id: "m11-dom-node",
      title: "DOM types aur @types/node",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>DOM types</strong> browser APIs ke TypeScript descriptions (<code>document</code>, <code>HTMLInputElement</code>) — <code>lib: DOM</code>. <strong>@types/node</strong> Node.js globals (<code>process</code>, <code>Buffer</code>, <code>fs</code>) ke community types.
        </div>
        <p><code>querySelector</code> generic ho sakta hai: <code>querySelector&lt;HTMLInputElement&gt;("input")</code> phir bhi null check. Env vars <code>string | undefined</code> — missing env production bug; schema se required keys.</p>
        <pre><code>const input = document.querySelector("input");
if (input) input.value = "ok";</code></pre>
      `
    }
  ]
});

NOTES.push({
  num: "12",
  title: "React + TypeScript",
  intro: "React component ek function hai jo UI return karta hai. TypeScript uske props, state, events ko contract deta hai taaki galat prop naam / type JSX mein pakda jaaye.",
  topics: [
    {
      id: "m12-props",
      title: "Components aur props",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Props</strong> parent se child ko data/callbacks. TS mein props ek object type/interface. <code>children</code> nested JSX — type aksar <code>React.ReactNode</code> (string, number, elements, arrays, null...).
        </div>
        <p><code>React.FC</code> (FunctionComponent) children implicit kar sakta tha purane versions mein — aaj kai teams plain <code>function Button(props: ButtonProps)</code> prefer. Explicit children clearer.</p>
        <p>Optional callbacks <code>?</code>. Union props + discriminant se variants (primary/secondary button) type-safe.</p>
        <pre><code>type ButtonProps = {
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export function Button({ label, onClick, children }: ButtonProps) {
  return (
    &lt;button onClick={onClick}&gt;
      {label} {children}
    &lt;/button&gt;
  );
}</code></pre>
      `
    },
    {
      id: "m12-hooks",
      title: "useState, useRef, useReducer, events, context",
      body: `
        <div class="def"><strong>Definition</strong>
        Hooks React ke functions hain state/refs/context ke liye. TS unke generic parameters se stored value ka type fix karta hai. Event objects ke types React namespace mein hain (<code>ChangeEvent</code>, <code>MouseEvent</code>) kyunki synthetic events hain.
        </div>
        <p><code>useState(0)</code> number infer. Null start: <code>useState&lt;User | null&gt;(null)</code> warna infer null-only, setUser user object pe error. <code>useRef</code> DOM: <code>HTMLInputElement | null</code> initial null. Context default null ho to consumers null check ya custom hook throw.</p>
        <pre><code>const [n, setN] = useState(0);
const [user, setUser] = useState&lt;User | null&gt;(null);
const ref = useRef&lt;HTMLInputElement | null&gt;(null);

function onChange(e: React.ChangeEvent&lt;HTMLInputElement&gt;) {
  console.log(e.target.value);
}

type Ctx = { theme: "light" | "dark" };
const Theme = React.createContext&lt;Ctx | null&gt;(null);</code></pre>
      `
    }
  ]
});

NOTES.push({
  num: "13",
  title: "Node backend + TypeScript",
  intro: "Backend pe types ka matlab: request in, response out, env config — teen boundaries. Express khud loosely typed ho sakta hai; tum layers add karte ho.",
  topics: [
    {
      id: "m13-express",
      title: "Express-style typing idea",
      body: `
        <div class="def"><strong>Definition</strong>
        Express HTTP middleware/handlers: <code>(req, res, next)</code>. <code>@types/express</code> inhe TypeScript interfaces deta hai. <code>Request</code> generics se <code>params</code>, <code>body</code>, <code>query</code> type kiye ja sakte hain.
        </div>
        <p><code>req.body as CreateUser</code> shortcut hai, validation nahi. Middleware JSON parse ke baad body unknown jaisa treat karo, schema se CreateUser banao, phir handler typed. Status codes + res.json payload ke liye response DTO.</p>
        <pre><code>import express, { Request, Response } from "express";

type CreateUser = { email: string; name: string };

app.post("/users", (req: Request, res: Response) => {
  const body = req.body as CreateUser; // better: zod parse
  res.json({ ok: true });
});</code></pre>
      `
    },
    {
      id: "m13-env-dto",
      title: "Env vars aur DTOs",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Environment variable</strong> process ke bahar se config (PORT, DATABASE_URL). Type: string | undefined. <strong>DTO</strong> (Data Transfer Object) woh shape jo network pe jaati/aati hai — DB row se alag ho sakti hai (password hash hide).
        </div>
        <p><code>Omit</code>/<code>Pick</code> se DTO banana DRY hai. Kabhi camelCase API vs snake_case DB — mapper functions typed. NestJS: decorators + emitDecoratorMetadata — same DTO idea, extra framework.</p>
        <pre><code>const port = Number(process.env.PORT ?? "3000");

type UserDTO = { id: number; name: string };
type CreateUserDTO = Omit&lt;UserDTO, "id"&gt;;</code></pre>
      `
    }
  ]
});

NOTES.push({
  num: "14",
  title: "Testing & quality",
  intro: "Type checker logical bugs (galat formula) nahi pakadta. Tests behaviour verify. Linter style + dangerous TS patterns. Teenon mila ke “quality”.",
  topics: [
    {
      id: "m14-test",
      title: "Vitest/Jest + type tests + ESLint",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Unit test</strong> chhote function ka expected output. <strong>Type test</strong> compile-time assert: “is expression ka type exactly T hai” — runtime nahi chalta kabhi-kabhi sirf <code>tsc</code>. <strong>ESLint</strong> static rules (unused vars, no-explicit-any). <strong>Prettier</strong> formatting, types nahi.
        </div>
        <p>Vitest/Jest TS ko transpile karke tests chalate hain. <code>expectTypeOf</code> generics libraries ke liye. CI pipeline typical: lint → <code>tsc --noEmit</code> → unit tests. College project mein bhi yeh teen commands README mein likh do.</p>
        <pre><code>import { expect, test } from "vitest";
import { add } from "./add";

test("add", () => {
  expect(add(1, 2)).toBe(3);
});</code></pre>
      `
    }
  ]
});

NOTES.push({
  num: "15",
  title: "Build tools",
  intro: "Build = source ko browser/Node ke readable/optimized JS mein lana. Typecheck alag philosophical job ho sakti hai transpile se.",
  topics: [
    {
      id: "m15-tools",
      title: "tsc vs Vite vs esbuild/swc",
      body: `
        <div class="def"><strong>Definition</strong>
        <code>tsc</code> official compiler: typecheck + optional JS/.d.ts emit. <strong>Vite</strong> frontend dev server + bundler, TS ko tez transpile. <strong>esbuild/swc</strong> extremely fast transpilers — types ignore karke syntax convert.
        </div>
        <p>Isliye “project chal raha hai” ≠ “types sahi hain”. Production app: bundler build + CI typecheck. Library npm publish: tsc declarations. Source maps debug. <code>isolatedModules</code> Vite ke saath almost required.</p>
        <table>
          <tr><th>Tool</th><th>Definition / role</th></tr>
          <tr><td><code>tsc</code></td><td>types + optional emit + .d.ts</td></tr>
          <tr><td>Vite</td><td>dev + bundle, fast TS transform</td></tr>
          <tr><td>esbuild / swc</td><td>speed transpile, no typecheck</td></tr>
        </table>
        <div class="warn">Galat types ke saath bhi site chalegi agar sirf Vite use karo. <code>tsc --noEmit</code> add karo.</div>
      `
    }
  ]
});

NOTES.push({
  num: "16",
  title: "Mini projects (apply karo)",
  intro: "Project ki definition yahan: chhota complete program jisme types boundary (input/file/API) pe lagao, sirf variables pe nahi. Skills lock karne ka tarika.",
  topics: [
    {
      id: "m16-p1",
      title: "1) CLI Todo",
      body: `
        <div class="def"><strong>Definition</strong>
        CLI app terminal se commands leti hai. Todo item ek typed record. Commands discriminated union — har command ke fields alag.
        </div>
        <p><strong>Kyun yeh project:</strong> unions, arrays, JSON parse + unknown, Node types. File save = persistence boundary — validate when reading.</p>
        <ul>
          <li>Shape: <code>{ id: string; title: string; done: boolean }</code></li>
          <li>Actions: add / list / toggle — tag field <code>type</code></li>
          <li>Corrupt JSON pe crash mat: Result/error message</li>
        </ul>
      `
    },
    {
      id: "m16-p2",
      title: "2) Typed REST client",
      body: `
        <div class="def"><strong>Definition</strong>
        REST client HTTP se resources nikalta hai. Generic <code>getJson&lt;T&gt;</code> ka matlab caller decide kare expected body type — better: T schema se infer.
        </div>
        <p>HTTP error vs JSON error alag. <code>r.ok</code> check. Endpoints map: <code>interface Api { "/users": User[] }</code> advanced. Pehle simple generic + Result.</p>
        <pre><code>async function getJson&lt;T&gt;(url: string): Promise&lt;T&gt; {
  const r = await fetch(url);
  if (!r.ok) throw new Error("HTTP " + r.status);
  return r.json() as Promise&lt;T&gt;;
}</code></pre>
      `
    },
    {
      id: "m16-p3",
      title: "3) Form + validation",
      body: `
        <div class="def"><strong>Definition</strong>
        Form user input ka structured object. Validation rules (email format, age range) runtime; types compile-time. Dono connect: schema se type infer, errors <code>Partial&lt;Record&lt;keyof Form, string&gt;&gt;</code>.
        </div>
        <p>Fields: name, email, age. Submit pe parse. UI mein field-level messages. Yeh Module 03 + 11 ka mix hai.</p>
      `
    },
    {
      id: "m16-p4",
      title: "4) React app YA Express API",
      body: `
        <div class="def"><strong>Definition</strong>
        CRUD: Create Read Update Delete. Shared DTO file frontend-backend same shape (monorepo) ya duplicated carefully. UI async state discriminated: idle | loading | success | error.
        </div>
        <p>Ek track choose: pages + hooks, ya routes + services. Types share karne se “User frontend vs User backend drift” kam.</p>
      `
    },
    {
      id: "m16-p5",
      title: "5) Tiny util library",
      body: `
        <div class="def"><strong>Definition</strong>
        Utility library chhote generic helpers publish karti hai. Consumers ko <code>.d.ts</code> chahiye — <code>declaration: true</code>. Tum types ke author ban jaate ho, sirf user nahi.
        </div>
        <p>Implement <code>pick</code>, <code>omit</code>, <code>groupBy</code> with keyof constraints. README mein type examples. Yeh Module 06–07 ko haath se sikhata hai.</p>
      `
    }
  ]
});

NOTES.push({
  num: "17",
  title: "Exam & interview sheet",
  intro: "Viva mein definition + 1 line difference + 1 example. Lamba paragraph mat ratna; exact words + contrast.",
  topics: [
    {
      id: "m17-qa",
      title: "Must-know Q&A",
      body: `
        <div class="def"><strong>Definition (exam style)</strong>
        TypeScript = JavaScript + static types + compiler. Types erase at compile time. Goal: catch errors early, document contracts.
        </div>
        <p><strong>any vs unknown?</strong> Dono “pata nahi”. <code>any</code> checks skip; <code>unknown</code> pehle narrow. Definition: unknown is type-safe any.</p>
        <p><strong>interface vs type?</strong> Objects dono. Unions/mapped/primitives = type. Merging = interface.</p>
        <p><strong>Types runtime pe kyun nahi?</strong> Erasure — tsc hata deta hai.</p>
        <p><strong>Narrowing?</strong> Control flow se union ko specific type banana.</p>
        <p><strong>Generics kyun?</strong> Reuse + input-output type relation preserve without any.</p>
        <p><strong>strict mode?</strong> Null, implicit any, init — zyada galati compile pe.</p>
        <p><strong>API safely?</strong> unknown + schema/guard. Assertion last.</p>
        <p><strong>never?</strong> Koi value nahi / function return nahi / impossible branch.</p>
        <p><strong>void?</strong> Koi meaningful return nahi; caller ignore kare.</p>
        <p><strong>tuple vs array?</strong> Tuple: fixed positions + mixed types. Array: list of same type, length free.</p>
      `
    },
    {
      id: "m17-cheatsheet",
      title: "One-page cheatsheet",
      body: `
        <div class="def"><strong>Definition</strong>
        Cheatsheet = high-frequency syntax ki pocket list. Samajh ke baad revision ke liye, pehli padhai ke liye nahi.
        </div>
        <pre><code>string number boolean null undefined bigint symbol
any unknown never void
T[]  [A, B]  A | B  A &amp; B
type X = ...   interface X { }
T extends U    keyof T    T[K]
Partial Pick Omit Record ReturnType
as   !   is   satisfies   as const</code></pre>
        <div class="tip">Roz 30 min: definition 2 baar padho, phir 5 lines code. Weekend mini project. 6–8 weeks BTech pace.</div>
      `
    },
    {
      id: "m17-order",
      title: "Padhai order (recommended)",
      body: `
        <div class="def"><strong>Definition</strong>
        Learning order dependencies follow karta hai: tools → core types → objects/functions → generics → unions/advanced → runtime truth → framework track → projects.
        </div>
        <ol>
          <li>00 Setup — tsc actually chalao, definition yaad rahegi</li>
          <li>02 Types — sabse zyada time, har definition yahan se judti hai</li>
          <li>03–04 objects + functions</li>
          <li>06 Generics</li>
          <li>07 Discriminated unions pehle, mapped/conditional baad</li>
          <li>09 + 11 compiler + erasure</li>
          <li>12 ya 13 track</li>
          <li>16 projects</li>
        </ol>
        <p>Module 01 parallel agar JS rusted hai. Library-level conditionals tab jab apps comfortable hon.</p>
      `
    }
  ]
});
