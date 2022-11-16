import {HOSTNAME} from './Host'

export const HOST = HOSTNAME

//user api
export const UserUrl = {
    // //get
    // viewAll: (HOST + "user/view/all"),
    // viewByID: (HOST + "user/view/id/"),
    //post
    // viewByEmailPass: (HOST + 'user/view/emailPass'),
    create: (HOST + '/user/signup'),
    login:(HOST + '/user/login'),
    verify:(HOST + '/user/verify'),
    edit: (HOST + '/user/edit')
    // edit: (HOST + 'user/edit'),
    // icon: (HOST + 'binary/resolve'),
    // certImg: (HOST + 'binary/img/id/'),

};
export const FoodUrl = {
    //post 
    foodRec: (HOST + '/foodRec/'),
    foodRecTest: (HOST + '/foodRec/foodRecTest/')

}


const apiUrl = { UserUrl, FoodUrl};

export default {
    apiUrl,
    HOST,
}