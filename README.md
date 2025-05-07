<h1 align="center">02 Investor tracker | Personal projects</h1>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How to use](#how-to-use)
- [What I learned](#what-i-learned)
- [Useful resources](#useful-resources)
- [Built with](#built-with)
- [Contact](#contact)

## Overview

![image](https://github.com/user-attachments/assets/65344595-e230-4603-9b81-b18aa55f493f)

## Features

The goal is to create a comprehensive tool to track all investments, including:

Investment Portfolio (Wallet):

- Visualization of all current investments.
- Current market price of each investment.
- Average purchase price of each investment.
- Profits and losses (absolute and percentage) per investment and totals.
- Visualization of portfolio distribution by asset type, etc.
- Visualization of total portfolio value.

Order History:

- Detailed record of all buy and sell orders.
- Complete information for each order: date, time, type (buy/sell), asset, quantity, price.
- Functionality to edit orders in case of errors.
- Functionality to filter and sort orders.

New Order Entry:

- Intuitive interface to add new buy and sell orders.
- Fields to enter all relevant order information.
- Data validation to prevent errors.
- Ability to add notes to the orders.
- Additional Features (Optional):
- Portfolio performance charts.

### How to use

First, it's an experimental application, 'Clear Wallet'. Its function is to clear everything, delete everything, reset everything; it's for playing around. The instructions are at the beginning of the page. Please read carefully, and try not to break it haha.

Okay, the following is a flowchart of how the classes work in this app. Although I didn't manage to give one or two classes perfectly accurate names, I ended up making the rest quite tidy; even after finishing the project, I organized and edited the names of others, seeking to make everything clearer and more ordered.

![image](https://github.com/user-attachments/assets/0d79d394-f8ae-442c-bfa2-cfda47e7cb30)

I'm not sure why I started the project from the Order modal; I suppose it was due to beginning the design from that point, perhaps reflecting the problem of wanting to cover everything at the same time. But anyway, that's where I started. Next is AddOrder, which is the class responsible for processing the data from the OrderModal that is sent via a form. This class (AddOrder) feeds into ActualizeWallet along with CurrencyService. The ActualizeWallet and ActualizeDataDOM classes don't contain specific functions in the traditional sense; I simply grouped within them everything needed in other parts of the code that required CurrencyService, attempting to maintain a minimum level of order. Finally, we arrive at the stage of updating the data on the page, managed by the ...Charts and ...Actualize classes.

### What I learned

- Simulation of obtaining data from a JSON database to then save it. Here we manipulate it from a variable.
- JavaScript manipulation with classes and methods. Code organization.
- Practice in all areas, although I don't think Tailwind is a good option, I think vanilla CSS is better.
- Implementation of a library to add graphics to the project.

I feel that for being the first project with classes and considering that I'm trying to recycle code, I'm doing well. But I feel that it can be improved a lot. This also speaks to the organization beforehand. What I had organized was very well structured, then things appeared that I didn't foresee and I got a bit stuck. Therefore, the conclusion I have is that the more organized and thought out the code is on paper, the easier it will be to program it later.

In terms of why I prefer vanilla CSS, I think it has a lot of potential as it's more customizable. I think Tailwind CSS might be good for making quick mockups, but for larger projects, I think I would prefer to work more with vanilla CSS. And let's not forget that I'm learning, it's my second project!

Regarding the time it took, I believe it's fair because I did many different and new things compared to the first project. I included methods and classes, I simulated a database, I worked differently on the data stored in localStorage (in a more organized way), I used a charts library, I made 4 different pages for the application, and I registered the hours and tasks performed. And let's not forget that I'm learning, it's my second project!

One of the things I did well in this project was realizing some errors or improvements that could be done better in a different way, and carrying it out. Executing that, thanks to the time it took, allowed me to have cleaner code and a more "simple" and organized way of programming.

While testing the page before moving on to create the charts, I discovered some small dragging issues that I fixed in a simple way, although I believe it wasn't effective. I haven't been able to dedicate much time to the project over the last two weeks, which has extended it, as I always had to review what I had done previously. I feel a bit lost on that front. Now all that's left is to create the charts, for which I already have a general idea of how Chart.js works.

Upon reaching the end of the project, I felt comfortable. We managed to do many different things, which allowed us to improve and learn by applying everything seen in the courses, and finally understand some concepts that weren't entirely clear before. I am very happy with the final result, and I hope that whoever sees it enjoys it.

Lastly, here is the hour log. It details the tasks and the time spent on each one. They totaled 104.5 hours. I found this tracking method much more pleasant than [keeping control with] a calendar. You can find the tracker here: [Investor Tracker Project](investor-tracker-project.pdf)

### Useful resources

- MDN (https://developer.mozilla.org/en-US/) - This always helps me use anything I don't remember.

### Built with

- Semantic HTML5 markup
- Tailwind CSS
- Flexbox
- CSS Grid
- JavaScript

## Author

- GitHub [@Emi-Leale](https://github.com/EmiLeale)
