NOTES.push({
  num: "05",
  title: "Classes & OOP",
  intro: "Class ki definition: constructor + fields + methods ka blueprint; instance uski copy. TS is JS class syntax pe types aur access modifiers add karta hai. Runtime pe yeh normal ES class hi hai.",
  topics: [
    {
      id: "m5-class",
      title: "Class, constructor, methods, parameter properties",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Class</strong> related data aur behaviour ko ek unit. <strong>Constructor</strong> instance banate waqt chalta hai. <strong>Method</strong> class ke andar function. <strong>Parameter property</strong> constructor parameter pe <code>public</code>/<code>private</code>/<code>readonly</code> — field declare + assign ek hi jagah.
        </div>
        <p>OOP se code organize hota hai (Student, BankAccount). TS extra: har field ka type, constructor args ka type, method return. <code>new Student(...)</code> ke bina class function ki tarah call mat karo.</p>
        <p>Parameter properties boilerplate kam karti hain — beginner ke liye pehle explicit fields likhna bhi theek hai samajhne ke liye, phir short syntax.</p>
        <pre><code>class Student {
  constructor(
    public name: string,
    private roll: number,
    readonly dept: string = "CSE"
  ) {}

  label(): string {
    return this.name + " - " + this.roll;
  }
}

const s = new Student("Neha", 21);
s.label();</code></pre>
      `
    },
    {
      id: "m5-access",
      title: "public, private, protected, readonly, #fields",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Access modifier</strong> kaun class ke bahar field/method dekh sakta hai. <code>public</code> sab (default). <code>private</code> sirf usi class body (TS compile-time). <code>protected</code> class + child classes. <code>#name</code> JavaScript native private — runtime pe bhi bahar se nahi. <code>readonly</code> reassignment band (constructor/declaration ke baad).
        </div>
        <p><code>private</code> JS emit mein still ek normal property ho sakti hai — console se change possible. True privacy chahiye to <code>#</code>. Exam mein yeh farq poochha jaata hai.</p>
        <pre><code>class Bank {
  #pin = 1234;
  private balance = 0;
  protected bankName = "SBI";
}</code></pre>
      `
    },
    {
      id: "m5-inherit",
      title: "Inheritance, super, abstract, implements",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Inheritance</strong> (<code>extends</code>) child parent ki properties/methods reuse. <code>super</code> parent constructor/method. <strong>Abstract class</strong> incomplete blueprint — khud <code>new</code> nahi, children implement karein abstract methods. <code>implements</code> class interface ki shape fulfil kare — yeh type check hai, runtime inheritance nahi.
        </div>
        <p>Abstract tab jab common code + “har shape ka area() hona chahiye”. Interface tab jab sirf contract, koi shared code nahi. Multiple interfaces implement ho sakte hain; class extend ek hi (JS single inheritance).</p>
        <pre><code>abstract class Shape {
  abstract area(): number;
  describe() { return "shape"; }
}

class Circle extends Shape {
  constructor(public r: number) { super(); }
  area() { return Math.PI * this.r ** 2; }
}

interface Printable { print(): void; }
class Report implements Printable {
  print() { console.log("ok"); }
}</code></pre>
      `
    },
    {
      id: "m5-getset-static",
      title: "Getters, setters, static",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Getter/setter</strong> property jaisi access, andar logic (validation). <strong>Static</strong> member instance pe nahi, class pe belong karta hai — saari instances share (<code>Counter.total</code>). Factory methods aksar static: <code>User.fromJson</code>.
        </div>
        <p>Getter ko function ki tarah mat call karo — <code>c.n</code> not <code>c.n()</code>. Setter assignment: <code>c.n = 2</code>. Static ko instance se access karna confusing; class name se access karo.</p>
        <pre><code>class Counter {
  static total = 0;
  private _n = 0;
  get n() { return this._n; }
  set n(v: number) {
    if (v &lt; 0) throw new Error("no");
    this._n = v;
  }
  constructor() { Counter.total++; }
}</code></pre>
      `
    }
  ]
});

NOTES.push({
  num: "06",
  title: "Generics",
  intro: "Generic ki definition: type ko parameter banana, jaise function value parameter leta hai. Ek logic, kai types, bina <code>any</code> ke relation preserve — input T to output bhi T.",
  topics: [
    {
      id: "m6-why",
      title: "Generic functions, interfaces, classes",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Type parameter</strong> (aksar <code>T</code>, <code>U</code>, <code>K</code>) placeholder hai jo call/use site pe actual type se fill hota hai. Generic function/interface/class us parameter se apni shape describe karti hai.
        </div>
        <p>Bina generic: <code>identity(x: any): any</code> — number do, return any, .toFixed nahi milta safely. Generic: number in, number out. API wrapper: <code>ApiRes&lt;User&gt;</code> vs <code>ApiRes&lt;Product[]&gt;</code> same <code>ok</code> field, alag <code>data</code>.</p>
        <p>Convention: <code>T</code> Type, <code>K</code> Key, <code>V</code> Value, <code>E</code> Element. Explicit <code>identity&lt;string&gt;("hi")</code> tab jab infer galat ho.</p>
        <pre><code>function identity&lt;T&gt;(value: T): T {
  return value;
}
const a = identity&lt;string&gt;("hi");
const b = identity(10); // T = number

interface ApiRes&lt;T&gt; {
  ok: boolean;
  data: T;
}
const res: ApiRes&lt;string[]&gt; = { ok: true, data: ["a"] };

class Box&lt;T&gt; {
  constructor(public value: T) {}
}</code></pre>
      `
    },
    {
      id: "m6-constraints",
      title: "Constraints, defaults",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Constraint</strong> <code>T extends Shape</code> — T ko Shape jaisa hona chahiye (yahan extends inheritance ka runtime nahi, type ke “assignable to” ka matlab). <strong>Default type parameter</strong> <code>T = string</code> — agar infer/specify na ho to fallback.
        </div>
        <p>Bina constraint <code>x.length</code> error — har T pe length nahi. Constraint <code>{ length: number }</code> se string aur array dono chalenge, number nahi. Yeh structural: duck typing at type level.</p>
        <pre><code>function len&lt;T extends { length: number }&gt;(x: T): number {
  return x.length;
}
len("abc");
len([1, 2]);
// len(10); // Error

function wrap&lt;T = string&gt;(x: T): T[] {
  return [x];
}</code></pre>
      `
    },
    {
      id: "m6-keyof",
      title: "keyof aur indexed access",
      body: `
        <div class="def"><strong>Definition</strong>
        <code>keyof T</code> object type T ki saari keys ka union of string(/number/symbol) literals. <strong>Indexed access</strong> <code>T[K]</code> us key ki value type. Saath mein <code>K extends keyof T</code> se galat key compile pe error.
        </div>
        <p>Yeh forms, i18n maps, “object se field nikaalo” helpers ka heart hai. <code>obj[key]</code> JS mein easily undefined; TS constraint se key valid.</p>
        <pre><code>type User = { id: number; name: string };
type Keys = keyof User; // "id" | "name"
type Name = User["name"]; // string

function get&lt;T, K extends keyof T&gt;(obj: T, key: K): T[K] {
  return obj[key];
}
get({ id: 1, name: "A" }, "name");</code></pre>
      `
    },
    {
      id: "m6-utils",
      title: "Utility types (built-in)",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Utility types</strong> TypeScript ke built-in generic helpers jo common transformations karte hain: optional banao, keys hatao, function se return nikaalo. Ye libraries nahi — compiler ke <code>lib</code> mein hain.
        </div>
        <p>Ratne se better: ek User type lo, har utility apply karke socho output kya hoga. PATCH API = <code>Partial</code>. Public profile = <code>Omit</code> password. Feature flags map = <code>Record</code>.</p>
        <table>
          <tr><th>Utility</th><th>Definition</th></tr>
          <tr><td><code>Partial&lt;T&gt;</code></td><td>har property optional</td></tr>
          <tr><td><code>Required&lt;T&gt;</code></td><td>har property required</td></tr>
          <tr><td><code>Readonly&lt;T&gt;</code></td><td>har property readonly</td></tr>
          <tr><td><code>Pick&lt;T, K&gt;</code></td><td>sirf selected keys</td></tr>
          <tr><td><code>Omit&lt;T, K&gt;</code></td><td>selected keys hatao</td></tr>
          <tr><td><code>Record&lt;K, V&gt;</code></td><td>keys K, values V wala object</td></tr>
          <tr><td><code>Exclude&lt;T, U&gt;</code></td><td>union T se U hatao</td></tr>
          <tr><td><code>Extract&lt;T, U&gt;</code></td><td>union se U se match nikaalo</td></tr>
          <tr><td><code>NonNullable&lt;T&gt;</code></td><td>null | undefined hatao</td></tr>
          <tr><td><code>ReturnType&lt;F&gt;</code></td><td>function F ka return</td></tr>
          <tr><td><code>Parameters&lt;F&gt;</code></td><td>params ka tuple type</td></tr>
          <tr><td><code>Awaited&lt;P&gt;</code></td><td>Promise ke andar ki value type</td></tr>
        </table>
        <pre><code>type User = { id: number; name: string; email: string };
type Patch = Partial&lt;User&gt;;
type Public = Omit&lt;User, "email"&gt;;
type Flags = Record&lt;"dark" | "rtl", boolean&gt;;</code></pre>
      `
    }
  ]
});

NOTES.push({
  num: "07",
  title: "Advanced types",
  intro: "Advanced types = types se naye types banana (compute). Framework authors yahi use karte hain. Pehle generics + unions tight hon.",
  topics: [
    {
      id: "m7-du",
      title: "Discriminated unions",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Discriminated union</strong> (tagged union) aisi union jahan har variant ek common property rakhe jiski value literal unique ho (discriminant / tag), jaise <code>status: "ok" | "error"</code>. Tag se TS baaki fields narrow kar leta hai.
        </div>
        <p>Bina tag ke union <code>{data:string} | {message:string}</code> pe dono fields optional jaise behave kar sakte hain — messy. Tag se switch clean. UI states: loading | success | error — yahi pattern.</p>
        <p><code>never</code> default case: agar koi variant chhoot jaaye, extra assign to never fail — exam mein “exhaustiveness check”.</p>
        <pre><code>type Ok = { status: "ok"; data: string };
type Err = { status: "error"; message: string };
type Result = Ok | Err;

function show(r: Result) {
  switch (r.status) {
    case "ok": return r.data;
    case "error": return r.message;
  }
}

function assertNever(x: never): never {
  throw new Error("unexpected");
}</code></pre>
      `
    },
    {
      id: "m7-guards",
      title: "User-defined type guards (is)",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Type predicate</strong> return type <code>x is T</code>. Function <code>true</code> return kare to compiler <code>x</code> ko type T maanta hai uske baad ke block mein. Normal <code>boolean</code> return se yeh magic nahi hota.
        </div>
        <p>Custom objects, union variants, <code>unknown</code> se domain types nikaalne ke liye. Predicate jhoot bole (runtime check kamzor) to types galat — guard logic sahi likhna zaroori.</p>
        <pre><code>function isString(x: unknown): x is string {
  return typeof x === "string";
}
function f(x: unknown) {
  if (isString(x)) x.toUpperCase();
}</code></pre>
      `
    },
    {
      id: "m7-conditional",
      title: "Conditional types aur infer",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Conditional type</strong> <code>T extends U ? X : Y</code> — agar T, U ko assignable hai to type X warna Y. <code>infer</code> extends clause ke andar naya type variable nikaalna, jaise Promise ke andar ki value.
        </div>
        <p>Yeh utility types ka engine hai: <code>Exclude</code> internally conditional. <strong>Distributive:</strong> naked <code>T</code> union ho to conditional har member pe alag apply — <code>A | B extends U ? ...</code> split. Wrap <code>[T]</code> se distribution band.</p>
        <pre><code>type IsStr&lt;T&gt; = T extends string ? "yes" : "no";
type A = IsStr&lt;"x"&gt;; // "yes"

type Unpack&lt;T&gt; = T extends Promise&lt;infer U&gt; ? U : T;
type B = Unpack&lt;Promise&lt;number&gt;&gt;; // number

type El&lt;T&gt; = T extends (infer I)[] ? I : never;</code></pre>
      `
    },
    {
      id: "m7-mapped-template",
      title: "Mapped types, template literals, satisfies, as const",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Mapped type</strong> keys ke set par loop karke naya object type: <code>{ [K in keyof T]: ... }</code>. <strong>Template literal type</strong> strings ko type-level concatenate (<code>getName</code> jaisa). <code>as const</code> assertion: values ko widest type nahi, literal + readonly. <code>satisfies</code> check that value type X ke compatible hai, lekin inference ko unnecessarily widen/narrow mat karo.
        </div>
        <p><code>Partial</code> khud mapped type hai. Key remap: <code>as</code> clause se naam badlo. <code>as const</code> routes object pe <code>keyof typeof routes</code> exact "home" | "user".</p>
        <pre><code>type Opt&lt;T&gt; = { [K in keyof T]?: T[K] };
type Getters&lt;T&gt; = {
  [K in keyof T as \`get\${Capitalize&lt;string &amp; K&gt;}\`]: () => T[K];
};

const routes = {
  home: "/",
  user: "/user"
} as const;
type RouteKey = keyof typeof routes;

type Colors = "red" | "blue";
const c = "red" satisfies Colors;</code></pre>
      `
    },
    {
      id: "m7-branded",
      title: "Branded / nominal typing",
      body: `
        <div class="def"><strong>Definition</strong>
        TS default <strong>structural typing</strong> use karta hai: shape same to type same. <strong>Nominal / branded type</strong> extra phantom property se do same-shape types ko alag maanna, jaise UserId vs OrderId dono string hon phir bhi mix na hon.
        </div>
        <p>Compile-time safety; runtime still plain string unless extra class. Factory function <code>as UserId</code> boundary pe. Money, IDs, email wrappers — domain-driven design mein useful.</p>
        <pre><code>type UserId = string &amp; { readonly __brand: "UserId" };
function UserId(s: string) { return s as UserId; }</code></pre>
      `
    }
  ]
});

NOTES.push({
  num: "08",
  title: "Modules, .d.ts, DefinitelyTyped",
  intro: "Module system types ko files ke beech move karta hai. Declaration files un libraries ko types deti hain jo JS mein likhi hain.",
  topics: [
    {
      id: "m8-esm",
      title: "ESM, CJS, import type",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>ESM</strong> (ES Modules) = <code>import</code>/<code>export</code>. <strong>CJS</strong> (CommonJS) = <code>require</code>/<code>module.exports</code>. <code>import type</code> sirf type-level import — emit JS se completely hata, circular value import avoid.
        </div>
        <p><code>module</code> + <code>moduleResolution</code> (node, node16, bundler, nodenext) decide: file extension, package.json <code>"type": "module"</code>, <code>exports</code> field. Mismatch = “cannot find module” errors jo types se related nahi lagte.</p>
        <pre><code>import { readFile } from "node:fs/promises";
import type { User } from "./user";
export type { User };
export { helper } from "./util";</code></pre>
      `
    },
    {
      id: "m8-dts",
      title: "Declaration files aur declare",
      body: `
        <div class="def"><strong>Definition</strong>
        <code>.d.ts</code> <strong>declaration file</strong> — types only, implementation nahi. <code>declare</code> compiler ko kehta hai “yeh cheez runtime pe maujood maan lo” (global, module, variable) bina TS source ke.
        </div>
        <p>DefinitelyTyped: community <code>@types/package</code>. Pehle <code>npm i -D @types/node</code> jaise. Agar types nahi: khud <code>declare module "legacy-lib"</code> ya <code>skipLibCheck</code> se dushman mat bano quietly.</p>
        <pre><code>declare const APP_VERSION: string;

declare module "legacy-lib" {
  export function start(): void;
}

declare function hello(name: string): void;</code></pre>
      `
    },
    {
      id: "m8-paths",
      title: "Path aliases, barrels, namespaces",
      body: `
        <div class="def"><strong>Definition</strong>
        <strong>Path alias</strong> chhota import path (<code>@lib/utils</code>) asli folder se map. <strong>Barrel file</strong> <code>index.ts</code> jo kai exports re-export kare. <strong>Namespace</strong> purana TS module grouping — aaj ES modules preferred.
        </div>
        <p>Alias tsconfig <code>paths</code> + bundler (Vite <code>resolve.alias</code>) dono set karo warna IDE theek, build toot. Barrels convenient; deep circular imports se bacho. Namespace exam history ke liye jaano, naya code mein mat likho unless global augmentation.</p>
        <pre><code>"paths": { "@lib/*": ["src/lib/*"] }</code></pre>
      `
    }
  ]
});

NOTES.push({
  num: "09",
  title: "tsconfig & compiler (deep)",
  intro: "Compiler option ki definition: tsc ka behaviour switch. Flags samajhna debugging skill hai, ratne wali list nahi.",
  topics: [
    {
      id: "m9-strict",
      title: "strict aur important flags",
      body: `
        <div class="def"><strong>Definition</strong>
        <code>strict</code> ek master switch hai jo kai safety flags ON karta hai. Har flag alag class ki galti rokta hai: null access, implicit any, uninitialized class fields, callback variance.
        </div>
        <p><code>strictNullChecks</code>: <code>string</code> mein null nahi. <code>noImplicitAny</code>: annotation/context ke bina any silently nahi. <code>strictFunctionTypes</code>: function params contravariant-ish — galat callback assign kam. <code>strictPropertyInitialization</code>: class field constructor mein set.</p>
        <p><code>noUncheckedIndexedAccess</code> strict bundle mein default nahi, lekin arrays pe <code>T | undefined</code> — real bugs pakadta hai. Students ko recommend.</p>
        <pre><code>const xs = ["a"];
const first = xs[0];
// noUncheckedIndexedAccess ON: string | undefined</code></pre>
      `
    },
    {
      id: "m9-emit",
      title: "target, lib, isolatedModules, skipLibCheck",
      body: `
        <div class="def"><strong>Definition</strong>
        <code>target</code> emitted JS ka language level. <code>lib</code> kaunse built-in type definitions load (DOM, ES2022). <code>isolatedModules</code> har file independently transpileable honi chahiye (const enums / some re-exports restrict). <code>skipLibCheck</code> third-party <code>.d.ts</code> ki type errors skip — speed vs hidden conflict.
        </div>
        <p>Vite/esbuild types check nahi karte; <code>tsc --noEmit</code> alag step. Library publish: <code>declaration: true</code> se <code>.d.ts</code> generate. <code>lib</code> mein DOM Node project pe mat daalna warna <code>document</code> galat jagah milta hai.</p>
      `
    }
  ]
});
