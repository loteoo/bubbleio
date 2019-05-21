# [how do i name this]
*Yet another community driven content sharing platform*



## In a nutshell
The goal is to create a content sharing platform 
where quality content is rewarded and exposed,
and discussions are naturally created without any friction.

At a first glance, it will look like a mix of reddit and slack,
but the core of the project comes from the highly "democratic",
real-time sorting algorithm which rewards invested users and
what the community wants.


```
Relevance = P + (messages / 4) / T ^ G

where,
P = points of an item
T = time since submission (in hours)
G = Gravity, defaults to 2 (controls the influence of "time" on the score)

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


