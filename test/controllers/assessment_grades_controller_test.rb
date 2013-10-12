require 'test_helper'

class AssessmentGradesControllerTest < ActionController::TestCase
  setup do
    @assessment_grade = assessment_grades(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:assessment_grades)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create assessment_grade" do
    assert_difference('AssessmentGrade.count') do
      post :create, assessment_grade: { assessment_id: @assessment_grade.assessment_id, student_id: @assessment_grade.student_id, total: @assessment_grade.total }
    end

    assert_redirected_to assessment_grade_path(assigns(:assessment_grade))
  end

  test "should show assessment_grade" do
    get :show, id: @assessment_grade
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @assessment_grade
    assert_response :success
  end

  test "should update assessment_grade" do
    patch :update, id: @assessment_grade, assessment_grade: { assessment_id: @assessment_grade.assessment_id, student_id: @assessment_grade.student_id, total: @assessment_grade.total }
    assert_redirected_to assessment_grade_path(assigns(:assessment_grade))
  end

  test "should destroy assessment_grade" do
    assert_difference('AssessmentGrade.count', -1) do
      delete :destroy, id: @assessment_grade
    end

    assert_redirected_to assessment_grades_path
  end
end
