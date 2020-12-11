import { RouteConfig } from 'vue-router'
import VueResource from 'vue-resource'
import Home from '@components/Home.vue'
import DutyRoster from '@components/DutyRoster/DutyRoster.vue'
import SetUp from '@components/DutyRoster/SetUp.vue'
import ManageSchedule from '@components/ShiftSchedule/ManageSchedule.vue'
import DistributeSchedule from '@components/ShiftSchedule/DistributeSchedule.vue'
import MyTeamMembers from '@components/MyTeam/MyTeamMembers.vue'
import DefineRolesAccess from '@components/MyTeam/DefineRolesAccess.vue'
import AssignmentTypes from '@components/ManageTypes/AssignmentTypes.vue'
import LeaveTrainingTypes from '@components/ManageTypes/LeaveTrainingTypes.vue'
import store from "@/store";

function displayFooter(to: any, from: any, next: any) {
  store.commit('CommonInformation/setDisplayFooter',true);
  next();
}

function waitFor(callback) {
  
  if(!store.state.CommonInformation.userDetails.homeLocationId) {
      
      window.setTimeout(waitFor.bind(null, callback), 100);

  } else {
      
      callback();
  }
}

async function checkPermission(to: any, from: any, next: any) {

  try {
    
    await store.state.CommonInformation.userDetails;
    await waitFor(() => {
      
      if (store.state.CommonInformation.userDetails.permissions.includes(to.meta.requiredPermission)){
        
        displayFooter(to, from, next);	
      } else {
        next({ path: "/" });
      }

    })  

  } catch(e) {
    next({ path: "/" });
  } 

}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    beforeEnter: displayFooter,
    component: Home
  },
  {
    path: '/duty-roster',
    name: 'DustyRoster',
    component: DutyRoster    
  },
  {
    path: '/duty-roster-setup',
    name: 'SetUp',
    beforeEnter: displayFooter,
    component: SetUp
  },
  {    
    path: '/manage-shift-schedule',
    name: 'ManageSchedule',
    beforeEnter: checkPermission,
    component: ManageSchedule,
    meta:{requiredPermission: 'ViewShifts'}
  },
  {
    path: '/distribute-shift-schedule',
    name: 'DistributeSchedule',
    beforeEnter: checkPermission,
    component: DistributeSchedule,
    meta:{requiredPermission: 'ViewDistributeSchedule'}  
  },
  {
    path: '/team-members',
    name: 'MyTeamMembers',
    beforeEnter: displayFooter,
    component: MyTeamMembers
  },
  {
    path: '/define-roles-access',
    name: 'DefineRolesAccess',
    beforeEnter: displayFooter,
    component: DefineRolesAccess  
  },
  {    
    path: '/assignment-types',
    name: 'AssignmentTypes',
    beforeEnter: checkPermission,
    component: AssignmentTypes,
    meta: {requiredPermission: 'EditTypes'}
  },
  {
    path: '/leave-training-types',
    name: 'LeaveTrainingTypes',
    beforeEnter: checkPermission,
    component: LeaveTrainingTypes,
    meta: {requiredPermission: 'EditTypes'}  
  }
]

export default routes