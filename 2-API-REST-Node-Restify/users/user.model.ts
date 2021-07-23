interface UserDataInterface {
  id: string;
  name: string;
  email: string;
}
const users: UserDataInterface[] = [
  { id: "1", name: "Peter Parker", email: "peter@marvel.com" },
  { id: "2", name: "Bruce Wayne", email: "bruce@dc.com" },
];

export default class User {
  static findAll(): Promise<UserDataInterface[]> {
    return Promise.resolve(users);
  }

  static findByID(id: string): Promise<UserDataInterface> {
    return new Promise((resolve) => {
      const filtered: UserDataInterface[] = users.filter(
        (user) => user.id === id
      );

      resolve(filtered[0]);
    });
  }
}
