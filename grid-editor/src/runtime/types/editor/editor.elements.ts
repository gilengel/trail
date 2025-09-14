import {Element} from "../../types/grid";
import {v4 as uuidv4} from "uuid";
import {defineAsyncComponent} from "vue";

export interface ElementTypeRegistry {
}

export type EditorElementMap = {
  [K in keyof ElementTypeRegistry]: EditorElementRegistryEntry<K>;
};

type EditorElementRegistryEntry<K extends keyof ElementTypeRegistry> =
  ElementTypeRegistry[K] extends EditorElement<
      infer Props,
      infer Provided,
      infer Consumed
    >
    ? EditorElement<Props, Provided, Consumed>
    : never;

export type EditorElement<
  Properties extends Record<string, any>,
  ProvidedProperties extends readonly (keyof Properties)[] = [],
  ConsumedProperties extends readonly (keyof Properties)[] = []
> = {
  key: string;
  element: ReturnType<typeof defineAsyncComponent>;
  propertyElement: ReturnType<typeof defineAsyncComponent>;
  defaults: {
    properties: Properties;
    providedProperties: ProvidedProperties;
    consumedProperties: ConsumedProperties;
  };
};

export class ElementHandler {
  private _registeredElements: EditorElementMap = {};

  /**
   * Use it to register your custom element for the editor you want to use
   *
   * @param type
   * @param element
   */
  public register<K extends keyof ElementTypeRegistry>(
    type: K,
    element: EditorElementRegistryEntry<K>
  ) {
    (this._registeredElements as any)[type] = element;
  }

  public create<K extends keyof ElementTypeRegistry>(
    type: K
  ): Element<
    EditorElementMap[K]["defaults"]["properties"],
    EditorElementMap[K]["defaults"]["providedProperties"],
    EditorElementMap[K]["defaults"]["consumedProperties"]
  > {
    const {properties, providedProperties, consumedProperties} =
      this._registeredElements[type].defaults;

    return new Element(
      uuidv4(),
      type,
      properties,
      providedProperties,
      consumedProperties,
      {},
      {}
    );
  }

  public get<K extends keyof ElementTypeRegistry>(
    type: K
  ): EditorElement<
    EditorElementMap[K]["defaults"]["properties"],
    EditorElementMap[K]["defaults"]["providedProperties"],
    EditorElementMap[K]["defaults"]["consumedProperties"]
  > {
    return this._registeredElements[type];
  }

  public all() {
    return this._registeredElements;
  }
}
