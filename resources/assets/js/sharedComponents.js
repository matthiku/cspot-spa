import Vue from 'vue'
import AlertCmp from './components/shared/Alert.vue'
import SuccessCmp from './components/shared/Success.vue'

import EditPlanDateTimeDialog from './components/Plan/Edit/EditPlanDateTimeDialog'
import EditPlanTypeDialog from './components/Plan/Edit/EditPlanTypeDialog'
import EditPlanStaffDialog from './components/Plan/Edit/EditPlanStaffDialog'
import EditPlanInfoField from './components/Plan/Edit/EditPlanInfoField'
import EditPlanStaffList from './components/Plan/Edit/EditPlanStaffList'
import EditPlanActionList from './components/Plan/Edit/EditPlanActionList'
import EditPlanActionScriptureDialog from './components/Plan/Edit/EditPlanActionScriptureDialog'
import DeletePlanDialog from './components/Plan/Edit/DeletePlanDialog'
import ShowListOfPlans from './components/Plan/View/PlansView.vue'
import ShowActionsChips from './components/Plan/View/ActionsChips.vue'
import ShowStaffChips from './components/Plan/View/StaffChips.vue'
import ShowYoutubeModal from './components/Plan/View/YoutubeModal.vue'
import ShowSimplePlanList from './components/Plan/View/PlanSelectList.vue'

import EditSongField from './components/Song/Edit/EditSongField'
import EditSongTextAreaField from './components/Song/Edit/EditSongTextAreaField'

import AdminUserList from './components/Admin/Users'
import AdminRoleList from './components/Admin/Roles'
import AdminTypeList from './components/Admin/Types'
import AdminEditFieldDialog from './components/Admin/Edit/EditFieldDialog'

export default function sharedComponents () {
  Vue.component('app-alert', AlertCmp)
  Vue.component('app-success', SuccessCmp)

  Vue.component('app-edit-plan-action-scripture-dialog', EditPlanActionScriptureDialog)
  Vue.component('app-edit-plan-action-list', EditPlanActionList)
  Vue.component('app-edit-plan-staff-list', EditPlanStaffList)
  Vue.component('app-edit-plan-info-field', EditPlanInfoField)
  Vue.component('app-edit-plan-staff-dialog', EditPlanStaffDialog)
  Vue.component('app-edit-plan-type-dialog', EditPlanTypeDialog)
  Vue.component('app-edit-plan-date-time-dialog', EditPlanDateTimeDialog)
  Vue.component('app-delete-plan-dialog', DeletePlanDialog)
  Vue.component('app-show-list-of-plans', ShowListOfPlans)
  Vue.component('app-show-youtube-modal', ShowYoutubeModal)
  Vue.component('app-show-staff-chips', ShowStaffChips)
  Vue.component('app-show-action-chips', ShowActionsChips)
  Vue.component('app-show-simple-plan-list', ShowSimplePlanList)

  Vue.component('app-edit-song-textarea-field', EditSongTextAreaField)
  Vue.component('app-edit-song-field', EditSongField)

  Vue.component('app-admin-user-list', AdminUserList)
  Vue.component('app-admin-type-list', AdminTypeList)
  Vue.component('app-admin-role-list', AdminRoleList)
  Vue.component('app-admin-edit-field-dialog', AdminEditFieldDialog)
}
