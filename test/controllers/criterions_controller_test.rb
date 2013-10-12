require 'test_helper'

class CriterionsControllerTest < ActionController::TestCase
  setup do
    @criterion = criterions(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:criterions)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create criterion" do
    assert_difference('Criterion.count') do
      post :create, criterion: { assessment_id: @criterion.assessment_id, max: @criterion.max, name: @criterion.name }
    end

    assert_redirected_to criterion_path(assigns(:criterion))
  end

  test "should show criterion" do
    get :show, id: @criterion
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @criterion
    assert_response :success
  end

  test "should update criterion" do
    patch :update, id: @criterion, criterion: { assessment_id: @criterion.assessment_id, max: @criterion.max, name: @criterion.name }
    assert_redirected_to criterion_path(assigns(:criterion))
  end

  test "should destroy criterion" do
    assert_difference('Criterion.count', -1) do
      delete :destroy, id: @criterion
    end

    assert_redirected_to criterions_path
  end
end
