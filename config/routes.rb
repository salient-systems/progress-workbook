Pwtest::Application.routes.draw do
  # get datums for typeahead
  get '/performance/search.json' => 'search#search', :defaults => { :format => 'json' }
  get '/students/search.json' => 'students#search', :defaults => { :format => 'json' }

  # performance page routes
  get '/p/sections/:sid/all' => 'performance#sectionAll', :defaults => { :format => 'json' }
  get '/p/sections/:sid/assesstype/:aid' => 'performance#sectionAssessType', :defaults => { :format => 'json' }
  get '/p/sections/:sid/assessment/:aid' => 'performance#sectionAssessment', :defaults => { :format => 'json' }
  get '/p/students/:sid/assesstype/:aid' => 'performance#studentAssessType', :defaults => { :format => 'json' }
  get '/p/students/:sid/assessment/:aid' => 'performance#studentAssessment', :defaults => { :format => 'json' }

  resources :studentassessments

  resources :terms

  resources :users do
    resources :sections
    resources :students
  end

  resources :class_students

  resources :assessment_grades

  resources :criterion_grades

  resources :criterions

  resources :assessments do
    resources :criterions
  end

  resources :assessment_types

  resources :assessment_types do
    resources :assessments
  end

  resources :sections do
    resources :students # or use - only: [:index, :new, :create]
    resources :assessment_types do
      resources :view
    end
  end

  resources :subjects

  resources :cohort_students

  resources :cohorts do
    resources :students
  end

  resources :students do
    resources :sections
  end

  resources :terms do
    resources :sections
  end

  resources :students do
    collection do
      post :import
    end
  end

  # catch-all route for angular templates
  get 'templates/:action' => 'templates#:action'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'templates#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
