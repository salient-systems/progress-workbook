require 'test_helper'

class AssessmentTypesControllerTest < ActionController::TestCase
  setup do
    @assessment_type = assessment_types(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:assessment_types)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create assessment_type" do
    assert_difference('AssessmentType.count') do
      post :create, assessment_type: { name: @assessment_type.name, view: @assessment_type.view }
    end

    assert_redirected_to assessment_type_path(assigns(:assessment_type))
  end

  test "should show assessment_type" do
    get :show, id: @assessment_type
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @assessment_type
    assert_response :success
  end

  test "should update assessment_type" do
    patch :update, id: @assessment_type, assessment_type: { name: @assessment_type.name, view: @assessment_type.view }
    assert_redirected_to assessment_type_path(assigns(:assessment_type))
  end

  test "should destroy assessment_type" do
    assert_difference('AssessmentType.count', -1) do
      delete :destroy, id: @assessment_type
    end

    assert_redirected_to assessment_types_path
  end
end
