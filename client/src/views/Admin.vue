<template lang="pug">
	div.container.mt-4
		div.card
			h5.card-header Admin page
			div.card-body
				h6.card-title Add Admin:
				make-admin-form(:auth="auth")
				h6.card-title Remove Admin:
				remove-admin-form(:auth="auth")
				br
				h6.card-title Add Course:
				add-course-form(:auth="auth")
				h6.card-title Remove Course:
				remove-course-form(:auth="auth")
				h6.card-title Remove User:
				remove-user-form(:auth="auth")



</template>
<script>
import MakeAdminForm from "../components/MakeAdminForm.vue";
import RemoveAdminForm from "../components/RemoveAdminForm.vue";
import AddCourseForm from "../components/AddCourseForm.vue";
import RemoveCourseForm from "../components/RemoveCourseForm.vue";
import RemoveUserForm from "../components/RemoveUserForm.vue";
export default {
  name: "page-admin",
  props: ["user", "auth"],
  components: {
    MakeAdminForm,
    RemoveAdminForm,
    AddCourseForm,
    RemoveCourseForm,
    RemoveUserForm
  }
};
</script>
