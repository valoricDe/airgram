/** Contains approximate storage usage statistics, excluding files of unknown file type */
export class StorageStatisticsFastBaseModel {
  public _: 'storageStatisticsFast'
  /** Approximate total size of files */
  public filesSize: number
  /** Approximate number of files */
  public fileCount: number
  /** Size of the database */
  public databaseSize: number
}
