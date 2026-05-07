/* 3D Align Tool for After Effects
   Install: copy this file to After Effects/Scripts/ScriptUI Panels, then open from Window.
*/
#target aftereffects

(function build3DAlignPanel(thisObj) {
    var SCRIPT_NAME = "3D Align";
    var EPSILON = 0.00001;
    var ICON_TEMP_FOLDER_NAME = "AE_3D_Align_Tool_embedded_icons";
    var ICON_DRAW_WIDTH = 24;
    var ICON_DRAW_HEIGHT = 21;
    var ICON_BUTTON_WIDTH = 28;
    var ICON_BUTTON_HEIGHT = 24;
    var REF_SELECTION = 0;
    var REF_COMPOSITION = 1;
    var REF_SAFE_MARGINS = 2;
    var REF_FIRST_SELECTED = 3;
    var REF_SELECTED_CAMERA = 4;
    var SAFE_MARGIN_PERCENT = 0.1;
    var ICON_CACHE = {};
    var EMBEDDED_ICONS = {
        align_bottom: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI1SURBVEhLlZZNbhNBEIW/ticmAgQIyAlgnQXKIbgMG3acgQ1nyCG8yB2SBSgsWLADx4QgEMhxEjLDgvdGNaWZsfykVvfUb1d1VdnlaD6v+I+ivdG5CfQC1EnOsJwRdSc6tzLlaD6fyZgNRYV9YA+ogCvRV8AJ8DfJRkRHlinI4U5SssAj4CuwE3jocvvApwG9oUsAlIkPIUIrzXqcodvPeoz6O9M7mbNDkmCjlA3hNhMC8htHWsm5jpFOg0LGRCuizxHBfuMIczod6ZABklykxd2Idto37DMwhirIV8CuIi5hNzoBFPVh6XH4FFgkmnEAvAeeA6/lpA5P8xl4B9wEnQI0bosIO34CnCWe8QL4CLwFXmUmcAk8A77nCF00bPF+iH9/oG2QnetkryHlOxfPGCZqDY+7jCa1VRtUbIsY4SbUwHoL+RZx0mT00Yx6JDqjT7/kBt4mrWODwYj2ilPqciakdZOxO5qnY4hP1CmaPG0c8SanY/N0CJ1ZatQy1vcGxkoy8TkiSuA1MSA7NCG2yQr4ACw1cb7o9/EU+KG0nop3Jp7XsabMVPbaAsujrQIeA3dD487UU7+kOAUeiP9HzX9Pur/lqAAPpfdTe41Gm/9iIOVD4KWcxf8xcVY6C26PKszTOmXqEHijvu2k1AacviXwTd8L4By40Hxcap1rWcbptY2FdNay30mpMQ0lXwdejM6F5rMRv613Eys6ho7OtyqYlW52qeWz6V5Xab8O53W4dAH4B+km2l5uLF0hAAAAAElFTkSuQmCC",
        align_hcenter: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJfSURBVEhLpZa/ihNRFMZ/dzbZuKiFIGIliKiNClqJL2DlIyhYCNr4CoKtjQ/gG4iVMEW2EMHCxkLcVUHYQsRGVCxWTWIyFn5n+HKchI1+MMzNueee893zL1OGdd3jDypgpnVG0buR3hXgBnAH2AJGSd8RZwGaSoIiY7HuUi5yVgGngcvACZ3LmHNiayoTNPZkR41u3wMO6xySTbTeDwy0DpsemQYoZVjX/aQUCOUBcAs4K9k6cBI4DzwF3ovAPuAFcB/4lZy2tsuwrgfANAQJBdgA3gFH8mYHPgAXgG8L6qF0FYqHs68bRQj3gvESm43nMDY8h12HlyEXXcham87cN5zEpCO/i1CU82g1l0NyGEb9hkWHM+tFmFpU1ox8W6XhMEKRQ1JWzF84mOnJ5Im26ApZKPaAm8ApY30GuAhsqi2iF3eAB8Cu38qILHSYbxmFMwAOAdeBu8A14LEcBJloMV8HSq5SR7Bq1NTrys8XIzQBvisKGza5Zslxa89vGBtBoAfcA87ZYI+9Y8Bx4DXw2cKGSDxXBCaSV0Egj7Y21sAB4A1wVL9XwQ5wCfiactlWYDiJ95qe/0FPz5ztZSU/XpLfvWCkIe5YWDQzy8m/InpxTuaNH+/I4yoTpgtd0Wsnjcc5ErwLPNFf01vgFfBShfRJ+h+BbVXrtnS2gGeqyr8IdzV+3DDKeV3yn3ofBG7re+Yq8EjyvvLWqOCmFtK2+iOHmUkoTOXoRzI0lt7IjMbQnqlYcv462yLWTsL3nDG6VV8O/LPCMWenskJxBU+47zcaZQ81Tzct1BnZZgH4Dd2vv0gJ8UGrAAAAAElFTkSuQmCC",
        align_left: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJPSURBVEhLnZW9ihVBEIW/npm764iRsU/gJnI1UgPBXBAEX8LMFSPRwOfwGXSVCRYEwVTXyMBADIwFQV111zttUmc8Nn3XcQ80/Vddp6q6ujrtDkPHH6ToO+A2sARuAZ+AlcnNgXRlX2xsnGxzA7gKXANOm8xcSJf0iTw1ayzpogH8DO8WwImQT7HfurI1utwRUiWkGTgF7AAXgS2gB+4GwUFEpgMOw5g25J/GfonJkLQ7DIsgEVkKgh3gMnAOuAHcL5SUeARsA18r+iYPm4r73mvsUTgKqwoZ3jdF4ohcwinCNQc5dLlHZU8DjJqswRh39S/IcDfWyROQ3btp0cZCKVeDQt+GDjUhK6SyRIc0Hu3Qhh08CiuLmOua4M/CSXvgSWTpFrAZFacDflnYMC8G4AWwX3gmJCqEEuyBZ0G4BN6F5X3c52ge6H7bWK/lxKS7djfuqUKq5PpuWavwLWyeohqdXJfd/vAxsj6qxiXgLHAGuBfEbfHeuiBWqFuTeQk8jL0ppLJQCnJYKMIlcB14EHL/g/fAeeBbzJMqjScBxVoXHh8Xm1bks/8WFKHVeO7Dr0F/6HSf8lAETk6sjcf4fIUxfg8l1F//oUi9RKmfW7xL6Kkoo1OpXGMPLcBb4A3wKtpezPeA19F8rPa8iNpY+w+JJHkMXAEuAB/jHvctkXLxPJQYKgr6mHM8C7A79JoqhbLsB/DZyFKQq+JgSg+i196hvcEkQmLTw9hEBVF4/fmoeahqa9TmIpwsiINfgDvATeBD4YmP1ftZh8tkIP8GphXPrHA7C0cAAAAASUVORK5CYII=",
        align_right: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJMSURBVEhLnZa9blNBEIW/XdsBDB0FHa8AES0oAmqEoKBKRU9JKh6DhhJqSrgII4RED1IaEK+ARIMgJNixKThzczwslpMjrXbv3b3zc87M2mXSdUP+omjM7Xmhdeu5hQI8BK4AD4Cv9n4BUJfP985oGM/PJa2L7N0E7gLnbb//NjvMcKMAI+AMcLqxdxY4Z+8rcMqCAaBMum509E2TwgJcBB4BYyAkOABmWm8A74BnwAvgBrAJfAYOzSbFNKShU5WTe8ATe99CJypfA1vAJeBTPlQ1Iu3IKLAA9hr6tVCVqcuUdabKmBvM6yUNVmAozVrf9+twuAo5oP+hyKFLRA4g6MwbjnUdToHvVkhNRIYtyoLKwRrtgxztW1VGfQQK/NsWXqVeRBeAHfVhBBLG5jo3UUu8Aq4Dl9UWfpn0beHGaRgjsTBWRf5WFaPLYAw8B66uagtfh15F2SBKI6igaSZH+5YxOjfQ2u/k/kyZdN2GNiKTbeC+GcaCCUTmEcACeAk81rzVoLQih5HJQvfkU+DOke218Qa4ZRpuitK5SbYUeRWNSyIfA55xPIc8vf5585cK4SSYqZCi8YP2GJCKJiIMTY+LkarUiyXPpXq6cnpSSufADyu0qOpAoVF9U+At8BHY1fxhxdi18V5yeEZhu6fWGz82UBMP7UfWWfBW2NDZPek/ULVes7Zwp9VTxirqwOgJmmOeiYkp8BP4pgugKshw4JQuIuNcND7HOmcfiOBir6Tfw8P89yI7xCNpOMraxECZzEXtDnAb+JLOANQ/2pHCkOV11TAAAAAASUVORK5CYII=",
        align_top: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI/SURBVEhLpZa9ihRBFIW/6p2dRQ3USBATRcQX0MDExMzcQIPF9/AxfAYzE4MOBuMNRANDEWRFERFNZFwdnZky8NzmzN3q2cADRXfVvXXP/avqLrO+3wUqUDTW/MOOzavWWii2P+uFzdWwMOv7qZHsAveBW8BEpCuNIp213ifmTJHu0uQFeAs8Bn6GM8UiBDgNPAHuav6/eAXcAeaRgTLr+4kpdMAl4Koi+G3O7AFT4Bew0FoBTmnfkeZTRXsEfAHeuR0njDQg4VngnqUravoCeKnU3QRuKOVVOmvgAHgj58LhYxE64Rq4DTzX3HEAPJCxZyLMeArsWyYI210iIjVFC0UR/Un7HJENl1egdj4xYadatFBVn2XjGAQixdHBA4IwENFVFXoMK+kus6ABr+GQ0ozqh7WBzkYLkVJHRRv8oIagbjGGXRTZaGAyJhurYTmBMHTHaohIj9mIhezNNkPYYc/7Agurr+uU2NQiaK0FTjo6a2usY00TcE+2NQSKYAEcZoHwNUemZ+1Sg7SUWtjRsXkIXAOu63kFuAw8amRo6NKYbIRunTiGqgvgEHgPfAA+anyXQ975oymtIttGOBjQe9QrI+ttEOaabbtF9vSxzhmK8hQbnrniJHH/FXXfGZNldEkfe49IgygwRBieBGLTp5H79LNqFISBiMafLitYSuJcYal5DVzQH8B54Bxw0b6F2aAjCNwBsGORlWJtrt+EOfAD+GaX+mAk2chrG6Rew7wpv2M3R9bxedgJWawVgL9Inb67VzyKjwAAAABJRU5ErkJggg==",
        align_vcenter: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJlSURBVEhLhZa9a1VBEMV/e5P3Ej8h4N9gZ6+FhYjaWCmCRRArC7ET0giC+gcINoKFKChoL1d4taCQXkT8AgmIItH4kYv67rU5czNv3u7LgWXvm9md2TlzdpM0qut5ppGALhplx/nib4+sr3LfyY3ObYjwAboYcJsYySe0jXEGmAcGmeCEoLGqVnNlh0ijuh7IGLEfOOw2LQIN8AT4HNZuh75FaVTXQxfUnHuB28AZZzesALeAsU7u95bQJ6wC1zb/3Vo7hd2iOLlknlajz9t7kVnCHHx/PTpgThSfB64D14Ab7vt4prcJUWo99IkXgXvAaWczXAFuAkvAK2BPXACsAseAX9ERK6zc6UsV7tTYMWPNUP5hqHRLrvqdZBtr5NC4HpcSAvxTjJ5O6yFhY6VRui6tTj6YkbBzbPli+gqTKLgLfADeAycnY/S4CrwGXgAL0SkcAF4Cb4BLStp5lbZK2gBrwFtgI0YRvgIfta6k8D9a80VsLCh+6ylpgMvAIeAI8Mz5PB4AJ4BTM+7rO+AocBC44x8Hr9IO+K1mpxkvSAN8EwMlYeHe3h86WMeMpo+VOIefmkuiQglsv2lkQjQGr6hSQlOwV2CEHdhi9HF9hZ5ak3UJFbAOnAUuABeBc8CynruVXDKgs6A+WVIFJcp2qb+bwFPgvp7BR8Bj4CHwPCOo1l+LSGsDfHI2j3XNJphW1VicpGR21Ty6pP9pphzq0T5Vuqmgc8B3BYv9S5nDE9YlE42nFNnGurhruuwbqi73N9AnMw1MJDKf9dA221w6aRy5NRE+5oQSJxzuOxc4wjNjyDHHfwP2uxU0qnyKAAAAAElFTkSuQmCC",
        dist_bottom: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJqSURBVEhLrZY9jhNBEIW/nrbZRcBGxIgLEBESkSEhcQFIEYKQa3AAYg5Ahoy0QhyAgIAAiZwICBD74zVrzxDw3vC2sSXzU1Jr+qeqq+vVq7LL/mw25acM+lpKs9fFfFij7/NeX9ufuafIYR6UmFvxHHBT86rzVeP0E/AuHLYPAihlfzab6AJLKhY5ewg8if11sgSuAJ+19p0OAmDYBJMVJsAOsBd6m2QCXNQDW4Qwct0aKIn1KTAXfNtI1TcRI5yfiZBQbA12mvUmOdIj+zV3DIhZibET3gmiThB9+WW3UU6knyj9JmYpodABu8BCUFbgEnDVNtIxOoP0DoGPclyFykJkst1gltrRNeAlMJXiIOMaeazSNRq9zhIlM78HXgAP7DhzaPh64HuTh2U4WOnlC0VjJJyaiXRPtT9NDrSF38VhifmygYZgnnPtfSORzF4piJE0lh441pgD3zS8dywmHoXOoeYHwFd9D+J8LhQGog4tjtT1ZFiLiLMn2Kcau0LB6xzZAMb8Jml86HkFHgN3gyid4MnyoemrK+AR8NYwSkrL0nFT8wo8B27H+bZyH3jWpAvi1UkEk6euM9hSlnGnU4Jz2OvidFyA87H+U+nUyP1oBzL20hKOB80d5d/ItGkOY6rsMJlkhX9xuFA5De0dbS+tovqJXncduKWcuGv4kbZJ26q6fKpaJWDtCYc2vKxfd+Skk5OVWpVJ1kcKUC1O4qfJKRmA98BMJVIywgrcAF5p/b/kNXBHMJP/aQbgAnBPXeI4YCxNA8+cOxI3BEM7V+QfgDdGIyO01GBty7KRbc2eW+AQZEt7bPcDvcvms0UUt4EAAAAASUVORK5CYII=",
        dist_hcenter: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ4SURBVEhLrZbNalRBEIW/vjOTjEZFcedCEBQRn0JciC5EEQRBfQbXvocIblzqXrjICGLMQl34AG5CTEj8QSIhiYlmctuF5wxlZ2acgAea7urqquqqrqp7U6+uO/xBBlKxzqKNSfeMyEtArkTYgA0a5idgBpgCWkAHOCg6iZ4u5MuLZIAkDyPDQr5AA9wDLutcvFyknwJPgF9BrtSbU6+up8S0gpY8y7p5G3gPnArCw/ACuAVsArsl0xerZMyhawFHgG4I37Tmf6HRuQMaM9JlJIIhh+Ym8BVYBdaA78An4GQQHIVLwJdC9htwMUQsV8VDzwOzwJzGa83b4cworOr8LPASeKX1WrThpIno6g0avd9h4O0EXj4H7gI7Spws+Sy6IboaBH9KqK95B1gP/FFoNG8HuS3pG+RJ6tV1OwjF8KIsbYDTwDntWbHl+po/AAsy4FIxTGcbLIsU7TkCNhJ5ztzdIbKjkKqg1GhJoYt3mDG/zThj0UOvc2mMYKA0hC7XCl5btnwKY8++DZrh0Npz5M0hFbPD7HKqxO/qvWN0YjIObMSk8SGvu8B9JYsVldEYhnfAA2BDdNQ5SBpvtMK7HVPX2S8+A+dDKdm7TBGaCjih9nYduPK3nonRBi4AV4FrwNHoZew0GbgNPA7C/wM3gGf2tGxtZ4E7CmlX38H9Yh14GErmEbAck8YfYKe7Y34cWCm1TYAl4Ix0lHWc/IYUddXRh3RORpeBRbWuBeCjxpLGosYK8CbkRolc/mI4mzz7XyV2FNenG3IV+mlbzdv0HsROk8KtvNdXPW1J0TbwQ8PrjcDbHGeMcFt75HiXhsfBZ2MIy3AO6N/Y8dvTYorqMwAAAABJRU5ErkJggg==",
        dist_left: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ+SURBVEhLhZY7ixRREIW/273jzLrjsohoaigIJkb+AWN/iYm6ZoogKD4CFUxMBEPzCRY1F8zUVBZUFEEwUOydnt1rUqc9c+0eDzTT93Wq6lTV7Uk7s9mIv8j2nv4z9rk1YDGwlnyyMhL9ngYuAIeB2vZqPRUk54DzwEbwaU/Jm7ENOd4nwFXgOXDKDMqIDKWIagI8BJ6Eg4qoVKIzWhlJDRzEk4EG2A9ioYpxirUm9h7E2Pl64RK0Ma5jrMN1GBkBmxGJnBrHeh3zo57olqAcus563wBeALvAJ+Aj8AF4A0yDXKpIkT2TVUrg6VCEmlwYQQucAY4BR+OZAidjbgwcMrIcTm4CW8AJ4Ehwd4G4QUUmgmmx7tgLh2qT/izwBfgOfAtl3ptR6CH0hLu8JZSreRRLjhxOin3HQ5mOd1VVKR99WESEc6tcv0AcjQ9UNBQJzuH5KmRzqupRS3vaeP+naARVWd+aQ3uy9WGJZH3cFY0iK+Ubkpqi+bFC68NSb7qkDnk9RKL28TT4vetY4pds8tDzOWQMk119KAdL5CisjksGc2GsnCuxHsbWY7wfxCVSEdRgWwwZEuYR0Tz2VuFAHyauXtkWLqvm+rCInOnyTsA74BbwCHgAPAauAz/iTAKSInRiGVxbEama/LfJ+RW4AVwGtoErwH3gp/Hkvl7zSC8FybXw9iZwEfgcN0hjxSIHdba1au5QGvSIWuAZcA+4A9wG7gJPjUTkXhyaxyPTgucwF48uZhVGCgkbu8rUe/qk1XFGY0fGDsqjCngLvIpPTbLDulXkkL7yr4GXwK/YUxbaUlukndlMd52ilTz+t0/SOfS1H4chXdKCy92d/QOBEcYZ2LkyBgAAAABJRU5ErkJggg==",
        dist_right: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJtSURBVEhLhZa9zwxRFMZ/Mzs7WIJ4I6LUiIioaCQarX/AP0JEIiREJCISpVpLucUWKKgVGq2QkPgKBfZ9d3Y055k8e8yMJ7mZnTPP+bjn494tFvP5FGgZR2GcEliHjJDru8sE1y3KRByCOBeA88Aek+dnC1TAReB0yDv75X+cFcGZAjPgCfAoDHZRJ50SOAE8BW4Be+1bW9oLFoCWjDbAMn6v470EJvEUivi+ivcWqJ2jH0pZGemqY1fTMDqzSLXjiTl3W44G+B08vIbCbuAh8A54D3yI51vgTHDWobMyXc8MEYzkqmvhRELYAKeALeBQrC3gCHA0eBWwy3T3A4eBfbEO9GROPoqcf5H6MI1nC+xEcOeAT5GJL8BX4Fk4FtfX2lPabXsA4qkeB4HjFohwLNnxJtzYoRP6IEeTqPVshKsu9dSCjUWOqA+e6hXwHfhhMkdXsyTvCu/pHKphFU+1+p+BUSCykJ21WNvK6Rg8Pet4rxNHyKnskNt3DF6XOvjbiSO4rQ2neQ7HoBNlEqfR1ILIGOqJcqgGfdDp0YbzwuYtQ8HlrLU+h0ImCUpjGw3zK5qnD9vBc9uFHMqBjGneMpZmoIr1HLgLPADuAfeBy3ESZXRdijkbcygjbehVwDfgDnA91jXgcc/gd8iCHeBKKN4AbgM3gavAy+DovmssvSsbsWW6DzdKVizm8yp2mFOrneiSrePa+gycTaeM9KV3EngNzIFLVtN/dqiUSrGxWdMh3fSMg+spSCz1rTbkgy9yTsMkHPwEFsAra/sM7fIj8AJ4Yz3REin160WRdBGZHEuvGqiPK9T2F6T7i/EX4x2/8mUzb7YAAAAASUVORK5CYII=",
        dist_top: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJPSURBVEhLpZY/ixRBEMV/Mzv7D1EwM9bYRDgjAxPBxETBxMTMD2HsRxA/gPgNZMFLjUyNBNFAQxH0PO+83dsZg3tveNvs3rr4oOmp6u6qflXVtVvtz2ZDztBpBqgley7Xt2GgeVmeq/Zns0aGW6ABbgM3dGigQ633a7QyVMVZr7c6VwNfgVeyAVDZYSVFA7wEHkj+X3wB9oAfukhVRUjRzfaA62Lgm/vGBDN/G61G7jsAXgNH0vUOnSsbGwCnki8Ad4E70nndTuz8ncLnEC+1ZrsAXeYwHSYuAi+Ah4W+xHvgHvAdOAm9nULQdzHkogtiLmbbkMxLfT/XEYJ0RCE3+j4PC+XKl6uDQO80Q0kxd7rIHxn7FywjdyaRAxeNb5G3SYb3gSfAsGDs9wXwFngGHBc2VuylQyPzmMh9YzmdB3vnLwvG6Mlk6yqZWTeQ8dMYv4FfMm6di8uFaKTcObEZzkZsPKbARPpRDLe+1I21d6KzTUFopbV12vBU76lZ04QdhZSzF5thoz2fgEcqvDOvRdHUwHPgcejsxKEpU5C6Uv8RuAkc9otFL+0UwqlycgW4JqZj3dQspjpzLDZOxSHwQXlGRXVSNu8qGrUxAt4Atwr9NhwAV4GfkjMt1aYw1XJ4WfIuGIntJIj0ZEqH1pUdaBd0CntGrLdjh2a2rgp3RSWHC31n8XXlw++iB2ZD3xUmYpZ9tPzwbTgdLIHPqjCP+TljofFt3Z8noX/4hPP8pZ4Al7SekbCcNTDU2SNVqrFSD2WnSbZG6jatU+g32vsLERroFw24OVkAAAAASUVORK5CYII=",
        dist_vcenter: "iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJpSURBVEhLjZa/zgxRGMZ/Z3bWJyxLJEh0JLgJnQtwCxQuQKJRa1CQUKGgcwVbrIhohEpEaCiUEo347/tmZxSed/LsmTMbT7J7zpzz/n3ec96ZtFwspkDHP6Rsjp4rjbGXI2RLcms6IeDGU7Z+BjgLzICJ5JLphN4+4Bxw0uQ8+Ir4KzjtpHQAuA3cA7aAtpB5DexRUI+AC1ojC6oFUjjM4YKBHY15livgF/DH5Faa5+iqEeORSSUHSVnMZMzrFFlO9bwF7NWaM9cLo0Uv7hx4BbwHTgFHgXfAG+C0ZRnO5wookBQ0WXDJM4xxF3BEhmdG3Qw4BpyQzFTrtQI6KP39wHGNjhSUtll2DfDDnnP8Vr0isxti45b2zwMvgGfAbtPrgKp0aAa8ZwiKGgV7OBcQDokJZ7Fzh55lKZDAxPajTiWs9FtjcMzwJkNJ9auVgQfqKLFUvBbdfzgMxBkooWR70NrQfCxz5GBH43a+aShlvtZp+sLaWglxaDqrUQn56ccPzWAje3ZMzCEb2Ij9NVrHhAfcG7w2lTXqHFXBft9pUhbxpgyjSde62GPBeYnW7mGeehz3McQ9TOo69/X6Wmr/LfAQuAp811rv1OmJTJsNUWN9tAG+AU+AK3IC8Bi4BNzNkunIOI6D0AIfgYvAdeCzDF8DLgNPdR0iqBb4Cvw0O85CrEHhcvr8gRrzJzm8CdyR4ZVka7PhAWwXrkVPaWzEL5TdWK9giF6Z9Ckyt71oDK4zoDTmnQw1OhTPgZcyEkFhdemAL8BrvZY+WKCeYQWktFws4h5FtjEPY/GJ0Ziy1yYMByutsZY75S9MBrU2HAOEvQAAAABJRU5ErkJggg=="
    };

    function createUI(parent) {
        var win = (parent instanceof Panel)
            ? parent
            : new Window("palette", SCRIPT_NAME, undefined, { resizeable: true });

        win.orientation = "column";
        win.alignChildren = ["left", "top"];
        win.spacing = 6;
        win.margins = 8;

        var alignToRow = win.add("group");
        alignToRow.orientation = "row";
        alignToRow.alignChildren = ["left", "center"];
        alignToRow.spacing = 8;
        alignToRow.add("statictext", undefined, "Align Layers to:");
        var alignTo = alignToRow.add("dropdownlist", undefined, ["Selection", "Composition", "Safe Margins", "First Selected", "Selected Camera"]);
        alignTo.selection = 0;
        alignTo.preferredSize.width = 170;

        var alignRow = win.add("group");
        alignRow.orientation = "row";
        alignRow.spacing = 6;

        addIconButton(alignRow, "align_left", "Align Left", function () { runAlign("left", alignTo.selection.index); });
        addIconButton(alignRow, "align_hcenter", "Align Horizontal Center", function () { runAlign("hcenter", alignTo.selection.index); });
        addIconButton(alignRow, "align_right", "Align Right", function () { runAlign("right", alignTo.selection.index); });
        addIconButton(alignRow, "align_top", "Align Top", function () { runAlign("top", alignTo.selection.index); });
        addIconButton(alignRow, "align_vcenter", "Align Vertical Center", function () { runAlign("vcenter", alignTo.selection.index); });
        addIconButton(alignRow, "align_bottom", "Align Bottom", function () { runAlign("bottom", alignTo.selection.index); });

        var divider = win.add("panel");
        divider.preferredSize = [246, 1];

        var distLabel = win.add("statictext", undefined, "Distribute Layers:");
        var distRow = win.add("group");
        distRow.orientation = "row";
        distRow.spacing = 6;

        addIconButton(distRow, "dist_top", "Distribute Top Edges", function () { runDistribute("top"); });
        addIconButton(distRow, "dist_vcenter", "Distribute Vertical Centers", function () { runDistribute("vcenter"); });
        addIconButton(distRow, "dist_bottom", "Distribute Bottom Edges", function () { runDistribute("bottom"); });
        addIconButton(distRow, "dist_left", "Distribute Left Edges", function () { runDistribute("left"); });
        addIconButton(distRow, "dist_hcenter", "Distribute Horizontal Centers", function () { runDistribute("hcenter"); });
        addIconButton(distRow, "dist_right", "Distribute Right Edges", function () { runDistribute("right"); });

        win.onResizing = win.onResize = function () {
            this.layout.resize();
        };

        return win;
    }

    function addIconButton(parent, iconName, helpTip, callback) {
        var iconFile = getIconFile(iconName);
        var button;
        if (iconFile && iconFile.exists) {
            button = parent.add("custombutton", undefined, "");
            button.iconImage = ScriptUI.newImage(iconFile);
            button.onDraw = drawFlatIconButton;
        } else {
            button = parent.add("button", undefined, fallbackLabel(iconName));
        }
        button.preferredSize = [ICON_BUTTON_WIDTH, ICON_BUTTON_HEIGHT];
        button.minimumSize = [ICON_BUTTON_WIDTH, ICON_BUTTON_HEIGHT];
        button.maximumSize = [ICON_BUTTON_WIDTH, ICON_BUTTON_HEIGHT];
        button.helpTip = helpTip;
        button.onClick = callback;
        return button;
    }

    function drawFlatIconButton() {
        var g = this.graphics;
        var icon = this.iconImage;
        if (!icon) {
            return;
        }

        var w = this.size[0];
        var h = this.size[1];
        var iconW = ICON_DRAW_WIDTH;
        var iconH = ICON_DRAW_HEIGHT;
        var x = Math.floor((w - iconW) / 2);
        var y = Math.floor((h - iconH) / 2);

        g.drawImage(icon, x, y, iconW, iconH);
    }

    function getIconFile(iconName) {
        try {
            if (ICON_CACHE[iconName] && ICON_CACHE[iconName].exists) {
                return ICON_CACHE[iconName];
            }

            var data = EMBEDDED_ICONS[iconName];
            if (!data) {
                return null;
            }

            var iconFolder = new Folder(Folder.temp.fsName + "/" + ICON_TEMP_FOLDER_NAME);
            if (!iconFolder.exists) {
                iconFolder.create();
            }

            var iconFile = new File(iconFolder.fsName + "/" + iconName + ".png");
            if (!iconFile.exists) {
                writeBinaryFile(iconFile, decodeBase64(data));
            }

            ICON_CACHE[iconName] = iconFile;
            return iconFile;
        } catch (err) {
            return null;
        }
    }

    function decodeBase64(input) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var clean = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var output = "";
        var buffer = 0;
        var bits = 0;

        for (var i = 0; i < clean.length; i++) {
            var c = clean.charAt(i);
            if (c === "=") {
                break;
            }

            var value = chars.indexOf(c);
            if (value < 0) {
                continue;
            }

            buffer = (buffer << 6) | value;
            bits += 6;

            if (bits >= 8) {
                bits -= 8;
                output += String.fromCharCode((buffer >> bits) & 0xff);
            }
        }

        return output;
    }

    function writeBinaryFile(file, binaryString) {
        file.encoding = "BINARY";
        file.open("w");
        file.write(binaryString);
        file.close();
    }

    function fallbackLabel(iconName) {
        var labels = {
            align_left: "|<",
            align_hcenter: "-|-",
            align_right: ">|",
            align_top: "T",
            align_vcenter: "+",
            align_bottom: "_",
            dist_top: "T=",
            dist_vcenter: "V=",
            dist_bottom: "B=",
            dist_left: "L|",
            dist_hcenter: "H|",
            dist_right: "R|"
        };
        return labels[iconName] || "";
    }

    function getActiveComp() {
        var item = app.project && app.project.activeItem;
        if (!(item instanceof CompItem)) {
            alert("Open or select a composition first.");
            return null;
        }
        return item;
    }

    function getMovableLayers(comp, minCount) {
        var selected = comp.selectedLayers;
        var layers = [];
        for (var i = 0; i < selected.length; i++) {
            var layer = selected[i];
            if (layer.locked || isCameraLayer(layer) || isLightLayer(layer) || !layer.property("ADBE Transform Group")) {
                continue;
            }
            var pos = layer.property("ADBE Transform Group").property("ADBE Position");
            if (pos && pos.value.length >= 2 && !pos.expressionEnabled && !pos.dimensionsSeparated) {
                layers.push(layer);
            }
        }

        if (layers.length < minCount) {
            alert("Select at least " + minCount + " unlocked 2D or 3D layer" + (minCount === 1 ? "." : "s."));
            return null;
        }
        return layers;
    }

    function isCameraLayer(layer) {
        return !!(layer && layer.property("ADBE Camera Options Group"));
    }

    function isLightLayer(layer) {
        return !!(layer && layer.property("ADBE Light Options Group"));
    }

    function makeEvaluator(comp) {
        var helper = comp.layers.addNull();
        helper.name = "__3D_ALIGN_EVAL__";
        helper.enabled = true;
        helper.guideLayer = true;
        helper.shy = true;
        helper.moveToEnd();
        helper.property("ADBE Transform Group").property("ADBE Opacity").setValue(0);

        var effects = helper.property("ADBE Effect Parade");
        var pointEffect = effects.addProperty("ADBE Point Control");
        var point = pointEffect.property("ADBE Point Control-0001");

        return {
            point: function (expr) {
                point.expression = expr;
                var v = point.value;
                return [v[0], v[1]];
            },
            remove: function () {
                helper.remove();
            }
        };
    }

    function pointExpr(layer, layerPointCode) {
        return "var L=thisComp.layer(" + layer.index + ");\n" +
            "try{var p=L.toComp(" + layerPointCode + ");[p[0],p[1]];}catch(err){[0,0];}";
    }

    function anchorExpr(layer) {
        return pointExpr(layer, "L.anchorPoint");
    }

    function cornerExpr(layer, cornerName) {
        var zSuffix = layer.threeDLayer ? ",0" : "";
        var pointCode =
            "(function(){var r=L.sourceRectAtTime(time,false);" +
            "var x=r.left,y=r.top;" +
            "if('" + cornerName + "'==='tr'){x=r.left+r.width;}" +
            "else if('" + cornerName + "'==='bl'){y=r.top+r.height;}" +
            "else if('" + cornerName + "'==='br'){x=r.left+r.width;y=r.top+r.height;}" +
            "return [x,y" + zSuffix + "];})()";
        return pointExpr(layer, pointCode);
    }

    function getLayerBounds(layer, evalr) {
        var sourceBounds = getSourceBounds(layer, evalr);
        var maskBounds = getMaskBounds(layer, evalr);
        if (maskBounds) {
            return intersectBounds(sourceBounds, maskBounds);
        }
        return sourceBounds;
    }

    function getSourceBounds(layer, evalr) {
        var pts = [
            evalr.point(cornerExpr(layer, "tl")),
            evalr.point(cornerExpr(layer, "tr")),
            evalr.point(cornerExpr(layer, "bl")),
            evalr.point(cornerExpr(layer, "br"))
        ];
        return boundsFromPoints(pts);
    }

    function getMaskBounds(layer, evalr) {
        var maskPoints = getLayerMaskPoints(layer);
        if (maskPoints.length === 0) {
            return null;
        }

        var pts = [];
        for (var i = 0; i < maskPoints.length; i++) {
            pts.push(evalr.point(localPointExpr(layer, maskPoints[i][0], maskPoints[i][1])));
        }

        return boundsFromPoints(pts);
    }

    function getLayerMaskPoints(layer) {
        var points = [];
        var masks = layer.property("ADBE Mask Parade");
        if (!masks || masks.numProperties === 0) {
            return points;
        }

        for (var i = 1; i <= masks.numProperties; i++) {
            var mask = masks.property(i);
            if (!isBoundsMask(mask)) {
                continue;
            }

            var pathProp = mask.property("ADBE Mask Shape");
            if (!pathProp) {
                continue;
            }

            var shape;
            try {
                shape = pathProp.valueAtTime(layer.containingComp.time, false);
            } catch (err) {
                shape = pathProp.value;
            }

            if (!shape || !shape.vertices || shape.vertices.length === 0) {
                continue;
            }

            for (var j = 0; j < shape.vertices.length; j++) {
                var v = shape.vertices[j];
                points.push([v[0], v[1]]);

                // Include tangent handles so curved masks do not under-report their visual bounds too badly.
                if (shape.inTangents && shape.inTangents[j]) {
                    points.push([v[0] + shape.inTangents[j][0], v[1] + shape.inTangents[j][1]]);
                }
                if (shape.outTangents && shape.outTangents[j]) {
                    points.push([v[0] + shape.outTangents[j][0], v[1] + shape.outTangents[j][1]]);
                }
            }
        }

        return points;
    }

    function isBoundsMask(mask) {
        if (!mask) {
            return false;
        }

        if (mask.enabled === false) {
            return false;
        }

        try {
            if (mask.maskMode === MaskMode.NONE || mask.maskMode === MaskMode.SUBTRACT) {
                return false;
            }
        } catch (err) {
        }

        return true;
    }

    function localPointExpr(layer, x, y) {
        var zSuffix = layer.threeDLayer ? ",0" : "";
        return pointExpr(layer, "[" + formatNumber(x) + "," + formatNumber(y) + zSuffix + "]");
    }

    function formatNumber(value) {
        if (!isFinite(value)) {
            return "0";
        }
        return String(Math.round(value * 10000) / 10000);
    }

    function boundsFromPoints(pts) {
        var minX = pts[0][0], maxX = pts[0][0], minY = pts[0][1], maxY = pts[0][1];
        for (var i = 1; i < pts.length; i++) {
            minX = Math.min(minX, pts[i][0]);
            maxX = Math.max(maxX, pts[i][0]);
            minY = Math.min(minY, pts[i][1]);
            maxY = Math.max(maxY, pts[i][1]);
        }
        return {
            left: minX,
            right: maxX,
            top: minY,
            bottom: maxY,
            hcenter: (minX + maxX) / 2,
            vcenter: (minY + maxY) / 2
        };
    }

    function intersectBounds(a, b) {
        var out = {
            left: Math.max(a.left, b.left),
            right: Math.min(a.right, b.right),
            top: Math.max(a.top, b.top),
            bottom: Math.min(a.bottom, b.bottom)
        };

        if (out.left > out.right || out.top > out.bottom) {
            return b;
        }

        out.hcenter = (out.left + out.right) / 2;
        out.vcenter = (out.top + out.bottom) / 2;
        return out;
    }

    function getSelectionBounds(layers, evalr) {
        var b = getLayerBounds(layers[0], evalr);
        var out = {
            left: b.left,
            right: b.right,
            top: b.top,
            bottom: b.bottom
        };
        for (var i = 1; i < layers.length; i++) {
            b = getLayerBounds(layers[i], evalr);
            out.left = Math.min(out.left, b.left);
            out.right = Math.max(out.right, b.right);
            out.top = Math.min(out.top, b.top);
            out.bottom = Math.max(out.bottom, b.bottom);
        }
        out.hcenter = (out.left + out.right) / 2;
        out.vcenter = (out.top + out.bottom) / 2;
        return out;
    }

    function getReferenceBounds(comp, layers, alignToIndex, evalr) {
        if (alignToIndex === REF_COMPOSITION || alignToIndex === REF_SELECTED_CAMERA) {
            return {
                left: 0,
                right: comp.width,
                top: 0,
                bottom: comp.height,
                hcenter: comp.width / 2,
                vcenter: comp.height / 2
            };
        }

        if (alignToIndex === REF_SAFE_MARGINS) {
            var insetX = comp.width * SAFE_MARGIN_PERCENT;
            var insetY = comp.height * SAFE_MARGIN_PERCENT;
            return {
                left: insetX,
                right: comp.width - insetX,
                top: insetY,
                bottom: comp.height - insetY,
                hcenter: comp.width / 2,
                vcenter: comp.height / 2
            };
        }

        if (alignToIndex === REF_FIRST_SELECTED && layers.length > 0) {
            return getLayerBounds(layers[0], evalr);
        }

        return getSelectionBounds(layers, evalr);
    }

    function metricAxis(metric) {
        return (metric === "left" || metric === "right" || metric === "hcenter") ? "x" : "y";
    }

    function moveLayerByCompDelta(layer, dx, dy, evalr) {
        if (Math.abs(dx) < EPSILON && Math.abs(dy) < EPSILON) {
            return;
        }

        var pos = layer.property("ADBE Transform Group").property("ADBE Position");
        var original = getPositionValueAtCompTime(pos, layer.containingComp);
        var compTime = layer.containingComp.time;
        var step = 10;
        var p0 = evalr.point(anchorExpr(layer));

        setPositionValue(pos, original[0] + step, original[1], original, compTime);
        var px = evalr.point(anchorExpr(layer));

        setPositionValue(pos, original[0], original[1] + step, original, compTime);
        var py = evalr.point(anchorExpr(layer));

        setPositionValue(pos, original[0], original[1], original, compTime);

        var ax = (px[0] - p0[0]) / step;
        var ay = (px[1] - p0[1]) / step;
        var bx = (py[0] - p0[0]) / step;
        var by = (py[1] - p0[1]) / step;
        var det = ax * by - ay * bx;

        if (Math.abs(det) < EPSILON) {
            return;
        }

        var localX = (dx * by - dy * bx) / det;
        var localY = (ax * dy - ay * dx) / det;

        setPositionValue(pos, original[0] + localX, original[1] + localY, original, compTime);
    }

    function getPositionValueAtCompTime(pos, comp) {
        if (pos.isTimeVarying) {
            return pos.valueAtTime(comp.time, false);
        }
        return pos.value;
    }

    function setPositionValue(pos, x, y, original, compTime) {
        var value;
        if (original.length >= 3) {
            value = [x, y, original[2]];
        } else {
            value = [x, y];
        }

        if (pos.isTimeVarying) {
            pos.setValueAtTime(compTime, value);
        } else {
            pos.setValue(value);
        }
    }

    function moveLayerMetricTo(layer, metric, target, evalr) {
        for (var i = 0; i < 3; i++) {
            var b = getLayerBounds(layer, evalr);
            var delta = target - b[metric];
            if (Math.abs(delta) < 0.25) {
                return;
            }
            if (metricAxis(metric) === "x") {
                moveLayerByCompDelta(layer, delta, 0, evalr);
            } else {
                moveLayerByCompDelta(layer, 0, delta, evalr);
            }
        }
    }

    function runAlign(metric, alignToIndex) {
        var comp = getActiveComp();
        if (!comp) {
            return;
        }

        var originalSelection = comp.selectedLayers;
        var cameraContext = null;
        var layers = getMovableLayers(comp, 1);
        if (!layers) {
            return;
        }

        var effectiveAlignToIndex = (layers.length === 1 && alignToIndex === REF_SELECTION) ? REF_COMPOSITION : alignToIndex;
        var movingLayers = getMovingLayersForAlign(layers, effectiveAlignToIndex);
        if (movingLayers.length === 0) {
            return;
        }

        app.beginUndoGroup(SCRIPT_NAME + " - Align");
        var evalr = null;
        try {
            if (effectiveAlignToIndex === REF_SELECTED_CAMERA) {
                cameraContext = beginSelectedCameraContext(comp, originalSelection);
                if (!cameraContext) {
                    return;
                }
            }

            evalr = makeEvaluator(comp);
            var ref = getReferenceBounds(comp, layers, effectiveAlignToIndex, evalr);
            for (var i = 0; i < movingLayers.length; i++) {
                moveLayerMetricTo(movingLayers[i], metric, ref[metric], evalr);
            }
        } catch (err) {
            alert("3D Align failed:\n" + err.toString());
        } finally {
            if (evalr) {
                evalr.remove();
            }
            if (cameraContext) {
                cameraContext.restore();
            }
            restoreSelection(originalSelection);
            app.endUndoGroup();
        }
    }

    function runDistribute(metric) {
        var comp = getActiveComp();
        if (!comp) {
            return;
        }

        var originalSelection = comp.selectedLayers;
        var layers = getMovableLayers(comp, 3);
        if (!layers) {
            return;
        }

        app.beginUndoGroup(SCRIPT_NAME + " - Distribute");
        var evalr = null;
        try {
            evalr = makeEvaluator(comp);
            var items = [];
            for (var i = 0; i < layers.length; i++) {
                var b = getLayerBounds(layers[i], evalr);
                items.push({ layer: layers[i], bounds: b, value: b[metric] });
            }

            if (metric === "hcenter" || metric === "vcenter") {
                distributeGaps(items, metric, evalr);
            } else {
                distributeMetric(items, metric, evalr);
            }
        } catch (err) {
            alert("3D Distribute failed:\n" + err.toString());
        } finally {
            if (evalr) {
                evalr.remove();
            }
            restoreSelection(originalSelection);
            app.endUndoGroup();
        }
    }

    function getMovingLayersForAlign(layers, alignToIndex) {
        if (alignToIndex !== REF_FIRST_SELECTED || layers.length < 2) {
            return layers;
        }

        var moving = [];
        for (var i = 1; i < layers.length; i++) {
            moving.push(layers[i]);
        }
        return moving;
    }

    function beginSelectedCameraContext(comp, selectedLayers) {
        var selectedCamera = getSelectedCamera(selectedLayers);
        if (!selectedCamera) {
            alert("Select a camera along with the layers, or choose another reference mode.");
            return null;
        }

        var cameraStates = [];
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layer(i);
            if (isCameraLayer(layer)) {
                cameraStates.push({ layer: layer, enabled: layer.enabled });
                layer.enabled = (layer === selectedCamera);
            }
        }

        return {
            restore: function () {
                for (var j = 0; j < cameraStates.length; j++) {
                    cameraStates[j].layer.enabled = cameraStates[j].enabled;
                }
            }
        };
    }

    function getSelectedCamera(selectedLayers) {
        for (var i = 0; i < selectedLayers.length; i++) {
            if (isCameraLayer(selectedLayers[i])) {
                return selectedLayers[i];
            }
        }
        return null;
    }

    function distributeMetric(items, metric, evalr) {
        items.sort(function (a, b) {
            return a.value - b.value;
        });

        var first = items[0].value;
        var last = items[items.length - 1].value;
        var gap = (last - first) / (items.length - 1);

        for (var i = 1; i < items.length - 1; i++) {
            moveLayerMetricTo(items[i].layer, metric, first + gap * i, evalr);
        }
    }

    function distributeGaps(items, metric, evalr) {
        var horizontal = metric === "hcenter";
        var startKey = horizontal ? "left" : "top";
        var endKey = horizontal ? "right" : "bottom";
        var sizeKey = horizontal ? "width" : "height";

        for (var i = 0; i < items.length; i++) {
            items[i].start = items[i].bounds[startKey];
            items[i].end = items[i].bounds[endKey];
            items[i][sizeKey] = items[i].end - items[i].start;
        }

        items.sort(function (a, b) {
            return a.start - b.start;
        });

        var firstStart = items[0].start;
        var lastEnd = items[items.length - 1].end;
        var totalSize = 0;
        for (i = 0; i < items.length; i++) {
            totalSize += items[i][sizeKey];
        }

        var gap = (lastEnd - firstStart - totalSize) / (items.length - 1);
        var cursor = firstStart;

        for (i = 1; i < items.length - 1; i++) {
            cursor += items[i - 1][sizeKey] + gap;
            moveLayerMetricTo(items[i].layer, startKey, cursor, evalr);
        }
    }

    function restoreSelection(layers) {
        for (var i = 0; i < layers.length; i++) {
            if (layers[i]) {
                layers[i].selected = true;
            }
        }
    }

    var panel = createUI(thisObj);
    if (panel instanceof Window) {
        panel.center();
        panel.show();
    } else {
        panel.layout.layout(true);
        panel.layout.resize();
    }
})(this);



