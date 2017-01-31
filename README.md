# We Can Save Democracy

## Summary
Web application to be hosted at "WeCanSaveDemocracy.org" to help citizens take political action on progressive issues by selecting from a list of available actions and events, and then adding that list of actions and events to their personal calendar (Google, Outlook, Apple, Yahoo, .ics download, etc).

The API for the actions and events is served via (don't laugh) WordPress using the "WP REST API" plugin. This allows us to quickly create new entities and add a remove new fields. Removing the need to create an admin panel for data entry by non-technical users reduces the scope and timeline of the project by (what I estimate as) over 50%.   

## Primary User Story
1. User clicks "Add Action" button on homepage
2. User checks the checkboxes for the causes they are interested in
3. The user sees a list of actions corresponding to the causes they selected
4. The list of actions is sorted by time commitment, from least to most time
5. There are 2 radio buttons that allow the user to re-sort the list from most to least time commitment
6. The user clicks the "Add Action" button to select the action they want to add to their list
7. If the action involves contacting a government official, they are taken to a page where they can add the representatives who represent their home address, and they can select as many of those representatives as they like. Once they select their representative(s), then their they add the action to the list from a button at the bottom of the page
8. Once an action is added, the user is taken back to the home screen/master list, and repeats the process to add as many actions as they like.
9. By default, any action that is not an event, defaults to being set to today's date. The user can click an "edit" button in the table row, which will allow them to change the start date, start time, and time commitment.
10. Once the user has added all of their actions/events, then they can click on an "add to calendar" button at the top of the page to add the list to the calendar of their choice.

Wireframes here:
https://docs.google.com/drawings/d/18aKq4ts9mo3d7j8q8ND-WAyaTnrhyrEH23iaM0WSb94/edit

###Getting Started###

Checkout this repo, install dependencies, then start the gulp process with the following:

```
	> git clone git@github.com:november9/wecansavedemocracy.git
	> cd wecansavedemocracy
	> npm install
	> npm start
```
