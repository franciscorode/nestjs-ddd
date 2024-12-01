export class User {
  name: string;
  uuid: string;

  constructor({ name, uuid }: { name: string; uuid: string }) {
    this.name = name;
    this.uuid = uuid;
  }
}
