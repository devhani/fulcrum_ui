import * as mobx from 'mobx'
import UIStore from './UIStore'

export default class RootStore {
  public uiStore: UIStore

  constructor() {
    this.uiStore = new UIStore(this)
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
