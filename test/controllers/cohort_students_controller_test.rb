require 'test_helper'

class CohortStudentsControllerTest < ActionController::TestCase
  setup do
    @cohort_student = cohort_students(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:cohort_students)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create cohort_student" do
    assert_difference('CohortStudent.count') do
      post :create, cohort_student: { student_id: @cohort_student.student_id, user_id: @cohort_student.user_id }
    end

    assert_redirected_to cohort_student_path(assigns(:cohort_student))
  end

  test "should show cohort_student" do
    get :show, id: @cohort_student
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @cohort_student
    assert_response :success
  end

  test "should update cohort_student" do
    patch :update, id: @cohort_student, cohort_student: { student_id: @cohort_student.student_id, user_id: @cohort_student.user_id }
    assert_redirected_to cohort_student_path(assigns(:cohort_student))
  end

  test "should destroy cohort_student" do
    assert_difference('CohortStudent.count', -1) do
      delete :destroy, id: @cohort_student
    end

    assert_redirected_to cohort_students_path
  end
end
