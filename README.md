# [how do i name this]
*Yet another community driven content sharing platform*



## In a nutshell
The goal is to create a content sharing platform 
where quality content is rewarded and exposed,
and discussions are naturally created without any friction.

At a first glance, it will look like a mix of reddit and slack,
but the core of the project comes from a real-time feed of post
that is sorted by an algorightm that manages to be democratic
while rewarding invested users and what the community expects.


**Part 1: Post relevance algorithm**
This part is very similar to reddit
```
Relevance score = P + (messages / 4) / T ^ G

where,
P = points of an item
T = time since submission (in hours)
G = Gravity, defaults to 2 (controls the influence of "time" on the score)

```

As you can see, the main factor of the relevance algorithm is the points that are given by the users.

This is a good overall solution, but the problem is that, by itself it assumes that every user thinks wisely about their votes. In a place where a user can only vote once, this means that a quick upvote to a funny cat picture will have as much effect as an upvote to a 1000 word detailed explaination about a subject.

Basically, users need to be more "concensius" about their votes. They also need a way to "upvote more" some post than others.

**Part 2: Multiple votes and stamina**


[stamina explaination]





Problem with this, is that "democratic" part

This means that in any bubble, a brand new user, with a very shallow understanding of the community and the topic, can moderate what is shown to all users, as much as some users of that community. The second part of making this system less spam-prone and make it reward invested users, is to control how much a user can "vote" on influence the posts.

Every user will have an "relevance" score



**Part 3: User relevance algorithm**

```
User relevance = P * 
```


Changes in relevance are updated in real-time for users to see
the impacts of their actions, and be updated about interesting
topics as soon as possible.




## The problems this is trying to solve

- https://www.youtube.com/watch?v=rPiF475oSc4
- https://www.youtube.com/watch?v=6SAkUs3urrg
- people creating accounts to promote content (reputation doesn't have any impact)
- new posts don't get the chance to be seen (should be fixed by the real-time )

- low effort posts get as much rep as high effort ones
  "haha this meme is funny" = 1 upvote, "Wow this 1000 word explanation is really insightful" = also 1 upvote

...


## UI goals
Content-first, (or content-only) UI.
The most bare bones, basic, easy to use UI possible.
Nearly everything you see on the screen is controlled by users.


## Technical goals
Emphasis on high performance, SSR with high SEO.
Minimal assets download. The core app should only have 3 lightweight files:
the html shell, a single js bundle and a single stylesheet.

The javascript bundle should be below ~20kb.
Surprisingly, this easily achievable using hyperapp


The site should also work offline for viewing only.


