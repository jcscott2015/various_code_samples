# Dynamic Views Sample Code
This code is a sample template for generating views that are defined by the Java backend. The backend sends HAL (Hypertext Application Language) formatted responses. If the response specifies a form link, for example, the angularjs front end uses the object and the dynamicViews directives to build a form with specific elements defined in the form object.

This code was a simple proof of concept to be outsourced later.

As the agDynamicView directive replaces itself with a view directive type, we found we needed to create a childScope and later destroy it to avoid scope.$watch recursion.