import { defineStore } from "pinia";
import storage from "../utils/storage";

export const useUserStore= defineStore({
  id:'user',
  state:()=>{
    return {
      userInfo:""||storage.getItem("userInfo")
    }
  },
  actions: {
    updateUserInfo(info:string | Object) {
      this.userInfo = info
      storage.setItem("userInfo",info)
    }
  }
})