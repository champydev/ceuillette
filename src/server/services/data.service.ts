import * as pg from 'pg';
export class DataService {
  public static async connect(): Promise<pg.Client> {
    return new Promise<pg.Client>((resolve, reject) => {
      const databaseURL =
        process.env.DATABASE_URL ||
        'postgres://postgres:Emash21@localhost:5432/Ceuillette';
      console.log('databaseURL : ' + databaseURL);
      const client = new pg.Client(databaseURL);
      client.connect((errConnection: any) => {
        if (errConnection == null) {
          resolve(client);
        } else {
          reject(errConnection);
        }
      });
    });
  }
  public static async executeSql(
    client: pg.Client,
    sql: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      client
        .query(sql)
        .then(() => {
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  public static async executeQuery(
    sql: string,
    values?: any[]
  ): Promise<pg.QueryResult> {
    const client = await DataService.connect();
    console.log("Execute "+sql);
    const result = await DataService.executeQueryInternal(client, sql, values);
    client.end();

    return result;
  }

  private static async executeQueryInternal(
    client: pg.Client,
    sql: string,
    values?: any[]
  ): Promise<pg.QueryResult> {
    return new Promise<pg.QueryResult>((resolve, reject) => {
      client
        .query(sql, values)
        .then((result: pg.QueryResult) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}
