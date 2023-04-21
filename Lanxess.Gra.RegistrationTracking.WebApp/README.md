# Registra

> Project Management Tracking

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

# Notes

## Recent Changes

- reduced components to pages where possible -> extraction to components only when necessary / usefull
- removed placeholder content
- changed to buefy as vuejs component framework
- removed stores as they are not necessary, complicate development and reduce reusability
- extraced async data table to separate package for reusability
- added `ProjectService` for API access to projects and reusable project functionality
- added `UserService` for API access to users and reusable user functionality
- added `/store/user.js` for storing the current user, might be subject for refactoring
- every API service should inherit `BaseApiService` for axios base configuration
- further reduction of code intended
- `AsyncDataTableComponent` might be subject for reforactoring to use VueJS compositioin API
- `pages/projects/_id/index.vue` should be base for project details; project is loaded in this component and should be provided to sub component's props
- every tab in project details should be put into a separate component
- bulma should be preferred over buefy components
- 
