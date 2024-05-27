type UserId = number;

type Data = {
  occEventId?: number;
  occId?: number;
};

export class PersistentDb {
  private static instance: PersistentDb;

  private constructor() {}

  public static getInstance(): PersistentDb {
    if (!PersistentDb.instance) {
      PersistentDb.instance = new PersistentDb();
    }

    return PersistentDb.instance;
  }

  private userData = new Map<UserId, Data>();

  public getUserData(userId: UserId): Data {
    return this.userData.get(userId) || {};
  }

  public appendUserData(userId: UserId, data: Data) {
    const userData = this.getUserData(userId);
    this.userData.set(userId, { ...userData, ...data });

    console.log(`updated`, this.userData);
  }
}
