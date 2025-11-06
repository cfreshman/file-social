// _01 - easy localStorage persistence

const _01 = (prefix='store') => {
  const key_flag = prefix + '-flag'
  const key_save_0 = prefix + '-save-0'
  const key_save_1 = prefix + '-save-1'

  let key, data
  const loadData = () => {
    key = JSON.parse(localStorage.getItem(key_flag) || '0')
    data = JSON.parse(localStorage.getItem(key === 0 ? key_save_0 : key_save_1) || '{}')
  }
  loadData()

  const saveData = () => {
    key = key === 0 ? 1 : 0
    localStorage.setItem(key === 0 ? key_save_0 : key_save_1, JSON.stringify(data))
    localStorage.setItem(key_flag, JSON.stringify(key))
  }

  // save data once per minute
  setInterval(saveData, 60_000)

  // save before unload
  window.addEventListener('beforeunload', saveData)

  // client API
  const store = {
    get data() { return data },
    save: () => saveData(),
  }

  return store
}

