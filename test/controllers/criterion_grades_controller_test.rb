require 'test_helper'

class CriterionGradesControllerTest < ActionController::TestCase
  setup do
    @criterion_grade = criterion_grades(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:criterion_grades)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create criterion_grade" do
    assert_difference('CriterionGrade.count') do
      post :create, criterion_grade: { assessment_id: @criterion_grade.assessment_id, criterion_id: @criterion_grade.criterion_id, score: @criterion_grade.score, student_id: @criterion_grade.student_id }
    end

    assert_redirected_to criterion_grade_path(assigns(:criterion_grade))
  end

  test "should show criterion_grade" do
    get :show, id: @criterion_grade
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @criterion_grade
    assert_response :success
  end

  test "should update criterion_grade" do
    patch :update, id: @criterion_grade, criterion_grade: { assessment_id: @criterion_grade.assessment_id, criterion_id: @criterion_grade.criterion_id, score: @criterion_grade.score, student_id: @criterion_grade.student_id }
    assert_redirected_to criterion_grade_path(assigns(:criterion_grade))
  end

  test "should destroy criterion_grade" do
    assert_difference('CriterionGrade.count', -1) do
      delete :destroy, id: @criterion_grade
    end

    assert_redirected_to criterion_grades_path
  end
end
