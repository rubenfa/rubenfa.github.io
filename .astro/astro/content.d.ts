declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"en/first-post/index.mdx": {
	id: "en/first-post/index.mdx";
  slug: "en/first-post";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/second-post/index.mdx": {
	id: "en/second-post/index.mdx";
  slug: "en/second-post";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"en/third-post/index.mdx": {
	id: "en/third-post/index.mdx";
  slug: "en/third-post";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-01-25-volver-a-windows-7-desde-windows-8-regresar-al/index.mdx": {
	id: "es/2013-01-25-volver-a-windows-7-desde-windows-8-regresar-al/index.mdx";
  slug: "es/2013-01-25-volver-a-windows-7-desde-windows-8-regresar-al";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-04-26-cursos-gratuitos-sobre-mongodb/index.mdx": {
	id: "es/2013-04-26-cursos-gratuitos-sobre-mongodb/index.mdx";
  slug: "es/2013-04-26-cursos-gratuitos-sobre-mongodb";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-05-03-anade-parametros-que-es-gratis/index.mdx": {
	id: "es/2013-05-03-anade-parametros-que-es-gratis/index.mdx";
  slug: "es/2013-05-03-anade-parametros-que-es-gratis";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-06-10-tutorial-mongodb-introduccion-a-nosql-y-las-bases/index.mdx": {
	id: "es/2013-06-10-tutorial-mongodb-introduccion-a-nosql-y-las-bases/index.mdx";
  slug: "es/2013-06-10-tutorial-mongodb-introduccion-a-nosql-y-las-bases";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-06-14-mejorando-la-consola-de-windows-con-conemu-y/index.mdx": {
	id: "es/2013-06-14-mejorando-la-consola-de-windows-con-conemu-y/index.mdx";
  slug: "es/2013-06-14-mejorando-la-consola-de-windows-con-conemu-y";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-06-20-tutorial-mongodb-instalacion-y-configuracion/index.mdx": {
	id: "es/2013-06-20-tutorial-mongodb-instalacion-y-configuracion/index.mdx";
  slug: "es/2013-06-20-tutorial-mongodb-instalacion-y-configuracion";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-06-26-tutorial-mongodb-operaciones-de-consulta/index.mdx": {
	id: "es/2013-06-26-tutorial-mongodb-operaciones-de-consulta/index.mdx";
  slug: "es/2013-06-26-tutorial-mongodb-operaciones-de-consulta";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-07-03-tutorial-mongodb-operaciones-de-consulta/index.mdx": {
	id: "es/2013-07-03-tutorial-mongodb-operaciones-de-consulta/index.mdx";
  slug: "es/2013-07-03-tutorial-mongodb-operaciones-de-consulta";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-07-10-tutorial-mongodb-operaciones-de-consulta-avanzadas/index.mdx": {
	id: "es/2013-07-10-tutorial-mongodb-operaciones-de-consulta-avanzadas/index.mdx";
  slug: "es/2013-07-10-tutorial-mongodb-operaciones-de-consulta-avanzadas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-07-18-tutorial-mongodb-operaciones-de-actualizacion-de/index.mdx": {
	id: "es/2013-07-18-tutorial-mongodb-operaciones-de-actualizacion-de/index.mdx";
  slug: "es/2013-07-18-tutorial-mongodb-operaciones-de-actualizacion-de";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-07-25-tutorial-mongodb-operaciones-de-actualizacion-de-ii/index.mdx": {
	id: "es/2013-07-25-tutorial-mongodb-operaciones-de-actualizacion-de-ii/index.mdx";
  slug: "es/2013-07-25-tutorial-mongodb-operaciones-de-actualizacion-de-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-08-01-tutorial-mongodb-indices/index.mdx": {
	id: "es/2013-08-01-tutorial-mongodb-indices/index.mdx";
  slug: "es/2013-08-01-tutorial-mongodb-indices";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-08-04-comprando-un-portatil-usado-pero-como-nuevo-en/index.mdx": {
	id: "es/2013-08-04-comprando-un-portatil-usado-pero-como-nuevo-en/index.mdx";
  slug: "es/2013-08-04-comprando-un-portatil-usado-pero-como-nuevo-en";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-10-02-mongodb-trucos-y-consejos-aplicaciones/index.mdx": {
	id: "es/2013-10-02-mongodb-trucos-y-consejos-aplicaciones/index.mdx";
  slug: "es/2013-10-02-mongodb-trucos-y-consejos-aplicaciones";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-10-10-tutorial-mongodb-introduccion-aggregation-framework/index.mdx": {
	id: "es/2013-10-10-tutorial-mongodb-introduccion-aggregation-framework/index.mdx";
  slug: "es/2013-10-10-tutorial-mongodb-introduccion-aggregation-framework";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-10-17-tutorial-mongodb-pipelines-aggregation-i/index.mdx": {
	id: "es/2013-10-17-tutorial-mongodb-pipelines-aggregation-i/index.mdx";
  slug: "es/2013-10-17-tutorial-mongodb-pipelines-aggregation-i";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-10-23-tutorial-mongodb-y-c-conexion-a-la-base-de-datos/index.mdx": {
	id: "es/2013-10-23-tutorial-mongodb-y-c-conexion-a-la-base-de-datos/index.mdx";
  slug: "es/2013-10-23-tutorial-mongodb-y-c-conexion-a-la-base-de-datos";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-10-24-tutorial-mongodb-aggregation-framework-ii/index.mdx": {
	id: "es/2013-10-24-tutorial-mongodb-aggregation-framework-ii/index.mdx";
  slug: "es/2013-10-24-tutorial-mongodb-aggregation-framework-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-10-31-tutorial-mongodb-operadores-expresion-i/index.mdx": {
	id: "es/2013-10-31-tutorial-mongodb-operadores-expresion-i/index.mdx";
  slug: "es/2013-10-31-tutorial-mongodb-operadores-expresion-i";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-11-05-tutorial-mongodb-operadores-expresion-ii/index.mdx": {
	id: "es/2013-11-05-tutorial-mongodb-operadores-expresion-ii/index.mdx";
  slug: "es/2013-11-05-tutorial-mongodb-operadores-expresion-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-11-08-tutorial-mongodb-csharp-consultas-i/index.mdx": {
	id: "es/2013-11-08-tutorial-mongodb-csharp-consultas-i/index.mdx";
  slug: "es/2013-11-08-tutorial-mongodb-csharp-consultas-i";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-11-12-javascript-que-son-los-closures/index.mdx": {
	id: "es/2013-11-12-javascript-que-son-los-closures/index.mdx";
  slug: "es/2013-11-12-javascript-que-son-los-closures";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-11-14-tutorial-mongodb-operadores-expresion-iii/index.mdx": {
	id: "es/2013-11-14-tutorial-mongodb-operadores-expresion-iii/index.mdx";
  slug: "es/2013-11-14-tutorial-mongodb-operadores-expresion-iii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-11-19-javascript-para-que-sirven-los-closures/index.mdx": {
	id: "es/2013-11-19-javascript-para-que-sirven-los-closures/index.mdx";
  slug: "es/2013-11-19-javascript-para-que-sirven-los-closures";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-11-21-tutorial-mongodb-aggregation-framework-operadores-iv/index.mdx": {
	id: "es/2013-11-21-tutorial-mongodb-aggregation-framework-operadores-iv/index.mdx";
  slug: "es/2013-11-21-tutorial-mongodb-aggregation-framework-operadores-iv";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-11-26-tutorial-mongodb-csharp-consultas-con-linq/index.mdx": {
	id: "es/2013-11-26-tutorial-mongodb-csharp-consultas-con-linq/index.mdx";
  slug: "es/2013-11-26-tutorial-mongodb-csharp-consultas-con-linq";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-11-28-tutorial-mongodb-mapreduce/index.mdx": {
	id: "es/2013-11-28-tutorial-mongodb-mapreduce/index.mdx";
  slug: "es/2013-11-28-tutorial-mongodb-mapreduce";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-12-05-tutorial-mongodb-alta-disponibilidad-replicas/index.mdx": {
	id: "es/2013-12-05-tutorial-mongodb-alta-disponibilidad-replicas/index.mdx";
  slug: "es/2013-12-05-tutorial-mongodb-alta-disponibilidad-replicas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-12-10-mundo-laboral-desarrollador-pescadilla-muerde-cola/index.mdx": {
	id: "es/2013-12-10-mundo-laboral-desarrollador-pescadilla-muerde-cola/index.mdx";
  slug: "es/2013-12-10-mundo-laboral-desarrollador-pescadilla-muerde-cola";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-12-10-windows-phone-introducion-mvvm-y-binding/index.mdx": {
	id: "es/2013-12-10-windows-phone-introducion-mvvm-y-binding/index.mdx";
  slug: "es/2013-12-10-windows-phone-introducion-mvvm-y-binding";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-12-12-tutorial-mongodb-creacion-configuracion-replicas/index.mdx": {
	id: "es/2013-12-12-tutorial-mongodb-creacion-configuracion-replicas/index.mdx";
  slug: "es/2013-12-12-tutorial-mongodb-creacion-configuracion-replicas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-12-17-mongodb-trucos-y-consejos-campos-autoincrementales/index.mdx": {
	id: "es/2013-12-17-mongodb-trucos-y-consejos-campos-autoincrementales/index.mdx";
  slug: "es/2013-12-17-mongodb-trucos-y-consejos-campos-autoincrementales";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013-12-19-windows-phone-binding-un-ejemplo-practico/index.mdx": {
	id: "es/2013-12-19-windows-phone-binding-un-ejemplo-practico/index.mdx";
  slug: "es/2013-12-19-windows-phone-binding-un-ejemplo-practico";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
