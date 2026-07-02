export interface IPerson {
  user?: {
    name: string;
    age: number;
  };
}
export interface IEvents {
  (e: "changeform", str: any): void;
}
