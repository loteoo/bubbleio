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

This is a good overall solution, but the problem is that, by itself, it assumes that every user thinks wisely about their votes. In a place where a user can only vote once, this means that a quick upvote to a funny cat picture will have as much impact as an upvote to a 1000 word detailed explaination about a subject.

Since the cat picture takes 2 seconds to look at and is funny, many users will upvote it.
Since the 1000 word explaination takes a while to read and evaluate, few users will upvote it.

Result: Cat pictures everywhere! Quick & easy content prevails and memes take over.


Basically, users need to be more "aware" about their votes. They also need a way to vote "more strongly" on  some post than others.

So how can we make sure users moderate carefully what a comunnity sees?

**Part 2: Multiple votes and stamina**


[stamina explaination]




Now we have fixed an important issue that is about rewarding quality content mode accurately.

We still face one last problem with this system. Some toxic group of users might want to abuse the voting mechanisms to promote their agendas. 
Basically, we need a way to know which users are more reputable than others.

We then give mode "stamina" to reputable users.

> Hold up, that doesn't sound very democratic

Depends on how stamina is given.



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


