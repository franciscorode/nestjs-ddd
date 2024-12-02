export class User {
  name: string;
  uuid: string;
  password: string;

  constructor({
    name,
    uuid,
    password,
  }: {
    name: string;
    uuid: string;
    password: string;
  }) {
    this.name = name;
    this.uuid = uuid;
    this.password = password;
  }
}
