require 'test_helper'

class ClassStudentsControllerTest < ActionController::TestCase
  setup do
    @class_student = class_students(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:class_students)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create class_student" do
    assert_difference('ClassStudent.count') do
      post :create, class_student: { section_id: @class_student.section_id, student_id: @class_student.student_id }
    end

    assert_redirected_to class_student_path(assigns(:class_student))
  end

  test "should show class_student" do
    get :show, id: @class_student
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @class_student
    assert_response :success
  end

  test "should update class_student" do
    patch :update, id: @class_student, class_student: { section_id: @class_student.section_id, student_id: @class_student.student_id }
    assert_redirected_to class_student_path(assigns(:class_student))
  end

  test "should destroy class_student" do
    assert_difference('ClassStudent.count', -1) do
      delete :destroy, id: @class_student
    end

    assert_redirected_to class_students_path
  end
end
