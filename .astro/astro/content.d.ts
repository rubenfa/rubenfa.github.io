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
"es/2013/2013-01-25-volver-a-windows-7-desde-windows-8-regresar-al/index.mdx": {
	id: "es/2013/2013-01-25-volver-a-windows-7-desde-windows-8-regresar-al/index.mdx";
  slug: "es/2013/2013-01-25-volver-a-windows-7-desde-windows-8-regresar-al";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-04-26-cursos-gratuitos-sobre-mongodb/index.mdx": {
	id: "es/2013/2013-04-26-cursos-gratuitos-sobre-mongodb/index.mdx";
  slug: "es/2013/2013-04-26-cursos-gratuitos-sobre-mongodb";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-05-03-anade-parametros-que-es-gratis/index.mdx": {
	id: "es/2013/2013-05-03-anade-parametros-que-es-gratis/index.mdx";
  slug: "es/2013/2013-05-03-anade-parametros-que-es-gratis";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-06-10-tutorial-mongodb-introduccion-a-nosql-y-las-bases/index.mdx": {
	id: "es/2013/2013-06-10-tutorial-mongodb-introduccion-a-nosql-y-las-bases/index.mdx";
  slug: "es/2013/2013-06-10-tutorial-mongodb-introduccion-a-nosql-y-las-bases";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-06-14-mejorando-la-consola-de-windows-con-conemu-y/index.mdx": {
	id: "es/2013/2013-06-14-mejorando-la-consola-de-windows-con-conemu-y/index.mdx";
  slug: "es/2013/2013-06-14-mejorando-la-consola-de-windows-con-conemu-y";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-06-20-tutorial-mongodb-instalacion-y-configuracion/index.mdx": {
	id: "es/2013/2013-06-20-tutorial-mongodb-instalacion-y-configuracion/index.mdx";
  slug: "es/2013/2013-06-20-tutorial-mongodb-instalacion-y-configuracion";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-06-26-tutorial-mongodb-operaciones-de-consulta/index.mdx": {
	id: "es/2013/2013-06-26-tutorial-mongodb-operaciones-de-consulta/index.mdx";
  slug: "es/2013/2013-06-26-tutorial-mongodb-operaciones-de-consulta";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-07-18-tutorial-mongodb-operaciones-de-actualizacion-de/index.mdx": {
	id: "es/2013/2013-07-18-tutorial-mongodb-operaciones-de-actualizacion-de/index.mdx";
  slug: "es/2013/2013-07-18-tutorial-mongodb-operaciones-de-actualizacion-de";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-08-04-comprando-un-portatil-usado-pero-como-nuevo-en/index.mdx": {
	id: "es/2013/2013-08-04-comprando-un-portatil-usado-pero-como-nuevo-en/index.mdx";
  slug: "es/2013/2013-08-04-comprando-un-portatil-usado-pero-como-nuevo-en";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-10-02-mongodb-trucos-y-consejos-aplicaciones/index.mdx": {
	id: "es/2013/2013-10-02-mongodb-trucos-y-consejos-aplicaciones/index.mdx";
  slug: "es/2013/2013-10-02-mongodb-trucos-y-consejos-aplicaciones";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-10-10-tutorial-mongodb-introduccion-aggregation-framework/index.mdx": {
	id: "es/2013/2013-10-10-tutorial-mongodb-introduccion-aggregation-framework/index.mdx";
  slug: "es/2013/2013-10-10-tutorial-mongodb-introduccion-aggregation-framework";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-10-17-tutorial-mongodb-pipelines-aggregation-i/index.mdx": {
	id: "es/2013/2013-10-17-tutorial-mongodb-pipelines-aggregation-i/index.mdx";
  slug: "es/2013/2013-10-17-tutorial-mongodb-pipelines-aggregation-i";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-10-23-tutorial-mongodb-y-c-conexion-a-la-base-de-datos/index.mdx": {
	id: "es/2013/2013-10-23-tutorial-mongodb-y-c-conexion-a-la-base-de-datos/index.mdx";
  slug: "es/2013/2013-10-23-tutorial-mongodb-y-c-conexion-a-la-base-de-datos";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-10-24-tutorial-mongodb-aggregation-framework-ii/index.mdx": {
	id: "es/2013/2013-10-24-tutorial-mongodb-aggregation-framework-ii/index.mdx";
  slug: "es/2013/2013-10-24-tutorial-mongodb-aggregation-framework-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-11-05-tutorial-mongodb-operadores-expresion-ii/index.mdx": {
	id: "es/2013/2013-11-05-tutorial-mongodb-operadores-expresion-ii/index.mdx";
  slug: "es/2013/2013-11-05-tutorial-mongodb-operadores-expresion-ii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-11-12-javascript-que-son-los-closures/index.mdx": {
	id: "es/2013/2013-11-12-javascript-que-son-los-closures/index.mdx";
  slug: "es/2013/2013-11-12-javascript-que-son-los-closures";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-11-14-tutorial-mongodb-operadores-expresion-iii/index.mdx": {
	id: "es/2013/2013-11-14-tutorial-mongodb-operadores-expresion-iii/index.mdx";
  slug: "es/2013/2013-11-14-tutorial-mongodb-operadores-expresion-iii";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-11-19-javascript-para-que-sirven-los-closures/index.mdx": {
	id: "es/2013/2013-11-19-javascript-para-que-sirven-los-closures/index.mdx";
  slug: "es/2013/2013-11-19-javascript-para-que-sirven-los-closures";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-11-21-tutorial-mongodb-aggregation-framework-operadores-iv/index.mdx": {
	id: "es/2013/2013-11-21-tutorial-mongodb-aggregation-framework-operadores-iv/index.mdx";
  slug: "es/2013/2013-11-21-tutorial-mongodb-aggregation-framework-operadores-iv";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-11-28-tutorial-mongodb-mapreduce/index.mdx": {
	id: "es/2013/2013-11-28-tutorial-mongodb-mapreduce/index.mdx";
  slug: "es/2013/2013-11-28-tutorial-mongodb-mapreduce";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-12-05-tutorial-mongodb-alta-disponibilidad-replicas/index.mdx": {
	id: "es/2013/2013-12-05-tutorial-mongodb-alta-disponibilidad-replicas/index.mdx";
  slug: "es/2013/2013-12-05-tutorial-mongodb-alta-disponibilidad-replicas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-12-10-mundo-laboral-desarrollador-pescadilla-muerde-cola/index.mdx": {
	id: "es/2013/2013-12-10-mundo-laboral-desarrollador-pescadilla-muerde-cola/index.mdx";
  slug: "es/2013/2013-12-10-mundo-laboral-desarrollador-pescadilla-muerde-cola";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-12-10-windows-phone-introducion-mvvm-y-binding/index.mdx": {
	id: "es/2013/2013-12-10-windows-phone-introducion-mvvm-y-binding/index.mdx";
  slug: "es/2013/2013-12-10-windows-phone-introducion-mvvm-y-binding";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-12-12-tutorial-mongodb-creacion-configuracion-replicas/index.mdx": {
	id: "es/2013/2013-12-12-tutorial-mongodb-creacion-configuracion-replicas/index.mdx";
  slug: "es/2013/2013-12-12-tutorial-mongodb-creacion-configuracion-replicas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2013/2013-12-17-mongodb-trucos-y-consejos-campos-autoincrementales/index.mdx": {
	id: "es/2013/2013-12-17-mongodb-trucos-y-consejos-campos-autoincrementales/index.mdx";
  slug: "es/2013/2013-12-17-mongodb-trucos-y-consejos-campos-autoincrementales";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2014/2014-01-20-opinion-el-buscador-imperfecto/index.mdx": {
	id: "es/2014/2014-01-20-opinion-el-buscador-imperfecto/index.mdx";
  slug: "es/2014/2014-01-20-opinion-el-buscador-imperfecto";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2014/2014-01-30-tutorial-mongodb-explicando-el-sharding-con-una/index.mdx": {
	id: "es/2014/2014-01-30-tutorial-mongodb-explicando-el-sharding-con-una/index.mdx";
  slug: "es/2014/2014-01-30-tutorial-mongodb-explicando-el-sharding-con-una";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2014/2014-02-20-muerte-al-tipo-de-sistemas-viva-el-tipo-de/index.mdx": {
	id: "es/2014/2014-02-20-muerte-al-tipo-de-sistemas-viva-el-tipo-de/index.mdx";
  slug: "es/2014/2014-02-20-muerte-al-tipo-de-sistemas-viva-el-tipo-de";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2014/2014-02-28-imputacion-de-horas-vamos-a-contar-mentiras/index.mdx": {
	id: "es/2014/2014-02-28-imputacion-de-horas-vamos-a-contar-mentiras/index.mdx";
  slug: "es/2014/2014-02-28-imputacion-de-horas-vamos-a-contar-mentiras";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2014/2014-04-11-heartbleed-o-el-ejemplo-codigo-abierto-no-es-mas-seguro/index.mdx": {
	id: "es/2014/2014-04-11-heartbleed-o-el-ejemplo-codigo-abierto-no-es-mas-seguro/index.mdx";
  slug: "es/2014/2014-04-11-heartbleed-o-el-ejemplo-codigo-abierto-no-es-mas-seguro";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2014/2014-08-01-la-deuda-tecnica-aplicada-a-los-desarrolladores/index.mdx": {
	id: "es/2014/2014-08-01-la-deuda-tecnica-aplicada-a-los-desarrolladores/index.mdx";
  slug: "es/2014/2014-08-01-la-deuda-tecnica-aplicada-a-los-desarrolladores";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2014/2014-10-02-tutorial-mongodb-eligiendo-una-sharding-key/index.mdx": {
	id: "es/2014/2014-10-02-tutorial-mongodb-eligiendo-una-sharding-key/index.mdx";
  slug: "es/2014/2014-10-02-tutorial-mongodb-eligiendo-una-sharding-key";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2014/2014-11-18-windows-phone-ejecutando-aplicaciones-android/index.mdx": {
	id: "es/2014/2014-11-18-windows-phone-ejecutando-aplicaciones-android/index.mdx";
  slug: "es/2014/2014-11-18-windows-phone-ejecutando-aplicaciones-android";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2015/2015-12-06-aprendiendo-elixir-o-intentandolo/index.mdx": {
	id: "es/2015/2015-12-06-aprendiendo-elixir-o-intentandolo/index.mdx";
  slug: "es/2015/2015-12-06-aprendiendo-elixir-o-intentandolo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-01-27-mis-progresos-aprendiendo-elixir/index.mdx": {
	id: "es/2016/2016-01-27-mis-progresos-aprendiendo-elixir/index.mdx";
  slug: "es/2016/2016-01-27-mis-progresos-aprendiendo-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-02-24-elixir-y-el-pattern-matching/index.mdx": {
	id: "es/2016/2016-02-24-elixir-y-el-pattern-matching/index.mdx";
  slug: "es/2016/2016-02-24-elixir-y-el-pattern-matching";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-03-02-los-atoms-en-elixir/index.mdx": {
	id: "es/2016/2016-03-02-los-atoms-en-elixir/index.mdx";
  slug: "es/2016/2016-03-02-los-atoms-en-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-03-21-tipos-colecciones-elixir/index.mdx": {
	id: "es/2016/2016-03-21-tipos-colecciones-elixir/index.mdx";
  slug: "es/2016/2016-03-21-tipos-colecciones-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-06-17-ser-ingeniero-o-no-ser-informatico/index.mdx": {
	id: "es/2016/2016-06-17-ser-ingeniero-o-no-ser-informatico/index.mdx";
  slug: "es/2016/2016-06-17-ser-ingeniero-o-no-ser-informatico";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-06-20-spacemacs-el-editor-perfecto-elixir/index.mdx": {
	id: "es/2016/2016-06-20-spacemacs-el-editor-perfecto-elixir/index.mdx";
  slug: "es/2016/2016-06-20-spacemacs-el-editor-perfecto-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-06-29-instalando-spacemacs-en-windows/index.mdx": {
	id: "es/2016/2016-06-29-instalando-spacemacs-en-windows/index.mdx";
  slug: "es/2016/2016-06-29-instalando-spacemacs-en-windows";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-07-14-efecto-einstellung-ocultando-ideas-brillantes-tras-buenas-ideas/index.mdx": {
	id: "es/2016/2016-07-14-efecto-einstellung-ocultando-ideas-brillantes-tras-buenas-ideas/index.mdx";
  slug: "es/2016/2016-07-14-efecto-einstellung-ocultando-ideas-brillantes-tras-buenas-ideas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-07-21-compartiendo-codigo-en-elixir/index.mdx": {
	id: "es/2016/2016-07-21-compartiendo-codigo-en-elixir/index.mdx";
  slug: "es/2016/2016-07-21-compartiendo-codigo-en-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-08-03-usando-estructuras-en-elixir/index.mdx": {
	id: "es/2016/2016-08-03-usando-estructuras-en-elixir/index.mdx";
  slug: "es/2016/2016-08-03-usando-estructuras-en-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-09-11-todo-es-fabuloso/index.mdx": {
	id: "es/2016/2016-09-11-todo-es-fabuloso/index.mdx";
  slug: "es/2016/2016-09-11-todo-es-fabuloso";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-09-27-acceso-a-bases-de-datos-con-elixir/index.mdx": {
	id: "es/2016/2016-09-27-acceso-a-bases-de-datos-con-elixir/index.mdx";
  slug: "es/2016/2016-09-27-acceso-a-bases-de-datos-con-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-10-10-tecnicas-para-mejorar-tu-memoria/index.mdx": {
	id: "es/2016/2016-10-10-tecnicas-para-mejorar-tu-memoria/index.mdx";
  slug: "es/2016/2016-10-10-tecnicas-para-mejorar-tu-memoria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-11-07-los-hypes-la-especializacion-y-que-aprender/index.mdx": {
	id: "es/2016/2016-11-07-los-hypes-la-especializacion-y-que-aprender/index.mdx";
  slug: "es/2016/2016-11-07-los-hypes-la-especializacion-y-que-aprender";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-11-30-behaviours-en-elixir/index.mdx": {
	id: "es/2016/2016-11-30-behaviours-en-elixir/index.mdx";
  slug: "es/2016/2016-11-30-behaviours-en-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2016/2016-12-14-ojala-hubiese-tenido-un-mentor/index.mdx": {
	id: "es/2016/2016-12-14-ojala-hubiese-tenido-un-mentor/index.mdx";
  slug: "es/2016/2016-12-14-ojala-hubiese-tenido-un-mentor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-01-10-objetivos-para-2017/index.mdx": {
	id: "es/2017/2017-01-10-objetivos-para-2017/index.mdx";
  slug: "es/2017/2017-01-10-objetivos-para-2017";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-01-25-protocols-en-elixir/index.mdx": {
	id: "es/2017/2017-01-25-protocols-en-elixir/index.mdx";
  slug: "es/2017/2017-01-25-protocols-en-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-02-15-fail-fast/index.mdx": {
	id: "es/2017/2017-02-15-fail-fast/index.mdx";
  slug: "es/2017/2017-02-15-fail-fast";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-03-01-productividad-con-gtd/index.mdx": {
	id: "es/2017/2017-03-01-productividad-con-gtd/index.mdx";
  slug: "es/2017/2017-03-01-productividad-con-gtd";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-03-15-ecto-configurando-repositorio-elixir/index.mdx": {
	id: "es/2017/2017-03-15-ecto-configurando-repositorio-elixir/index.mdx";
  slug: "es/2017/2017-03-15-ecto-configurando-repositorio-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-03-29-jugando-con-strings-en-elixir/index.mdx": {
	id: "es/2017/2017-03-29-jugando-con-strings-en-elixir/index.mdx";
  slug: "es/2017/2017-03-29-jugando-con-strings-en-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-04-12-el-sindrome-del-impostor/index.mdx": {
	id: "es/2017/2017-04-12-el-sindrome-del-impostor/index.mdx";
  slug: "es/2017/2017-04-12-el-sindrome-del-impostor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-05-10-dynamic-vs-static/index.mdx": {
	id: "es/2017/2017-05-10-dynamic-vs-static/index.mdx";
  slug: "es/2017/2017-05-10-dynamic-vs-static";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-05-31-clausula-with-en-elixir/index.mdx": {
	id: "es/2017/2017-05-31-clausula-with-en-elixir/index.mdx";
  slug: "es/2017/2017-05-31-clausula-with-en-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-06-13-tercera-edicion-codenares/index.mdx": {
	id: "es/2017/2017-06-13-tercera-edicion-codenares/index.mdx";
  slug: "es/2017/2017-06-13-tercera-edicion-codenares";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-06-28-debugging-elixir/index.mdx": {
	id: "es/2017/2017-06-28-debugging-elixir/index.mdx";
  slug: "es/2017/2017-06-28-debugging-elixir";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-09-13-en-continua-formacion/index.mdx": {
	id: "es/2017/2017-09-13-en-continua-formacion/index.mdx";
  slug: "es/2017/2017-09-13-en-continua-formacion";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-09-20-spacemacs-mi-configuracion-personal/index.mdx": {
	id: "es/2017/2017-09-20-spacemacs-mi-configuracion-personal/index.mdx";
  slug: "es/2017/2017-09-20-spacemacs-mi-configuracion-personal";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2017/2017-10-11-libros-para-flipados/index.mdx": {
	id: "es/2017/2017-10-11-libros-para-flipados/index.mdx";
  slug: "es/2017/2017-10-11-libros-para-flipados";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2018/2018-01-03-objetivos-para-2018/index.mdx": {
	id: "es/2018/2018-01-03-objetivos-para-2018/index.mdx";
  slug: "es/2018/2018-01-03-objetivos-para-2018";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2018/2018-01-24-ojala-hubiese-tenido-un-mentor-la-charla-episodio-i/index.mdx": {
	id: "es/2018/2018-01-24-ojala-hubiese-tenido-un-mentor-la-charla-episodio-i/index.mdx";
  slug: "es/2018/2018-01-24-ojala-hubiese-tenido-un-mentor-la-charla-episodio-i";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
"es/2018/2018-03-07-deep-work/index.mdx": {
	id: "es/2018/2018-03-07-deep-work/index.mdx";
  slug: "es/2018/2018-03-07-deep-work";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		"pages": Record<string, {
  id: string;
  collection: "pages";
  data: any;
}>;

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
