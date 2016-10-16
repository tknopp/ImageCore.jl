var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "ImageCore.jl",
    "title": "ImageCore.jl",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#ImageCore.jl-1",
    "page": "ImageCore.jl",
    "title": "ImageCore.jl",
    "category": "section",
    "text": "ImageCore is the lowest-level component of the system of packages designed to support image processing and computer vision. Its main role is to simplify \"conversions\" between different image representations through different \"view\" types, and to provide some useful low-level functions (including \"traits\") that simplify image display, input/output, and the writing of algorithms.Pages = [\"views.md\", \"map.md\", \"traits.md\", \"reference.md\"]"
},

{
    "location": "views.html#",
    "page": "Views",
    "title": "Views",
    "category": "page",
    "text": ""
},

{
    "location": "views.html#Views-1",
    "page": "Views",
    "title": "Views",
    "category": "section",
    "text": "ImageCore provides several different kinds of \"views.\" Generically, a view is an interpretation of array data, one that may change the apparent meaning of the array but which shares the same underlying storage: change an element of the view, and you also change the original array. Views allow one to process images of immense size without making copies, and write algorithms in the most convenient format often without having to worry about the potential cost of converting from one format to another.To illustrate views, it's helpful to begin with a very simple image:julia> using Colors\n\njulia> img = [RGB(1,0,0) RGB(0,1,0);\n              RGB(0,0,1) RGB(0,0,0)]\n2×2 Array{ColorTypes.RGB{FixedPointNumbers.UFixed{UInt8,8}},2}:\n RGB{U8}(1.0,0.0,0.0)  RGB{U8}(0.0,1.0,0.0)\n RGB{U8}(0.0,0.0,1.0)  RGB{U8}(0.0,0.0,0.0)DocTestSetup = quote\n    using Colors, ImageCore\n    img = [RGB(1,0,0) RGB(0,1,0);\n           RGB(0,0,1) RGB(0,0,0)]\n    v = channelview(img)\n    r = rawview(v)\nendRGB is described in the Colors package, and the image is just a plain 2×2 array containing red, green, blue, and black pixels.  In Julia's color package, \"1\" means \"saturated\" (e.g., \"full red\"), and \"0\" means \"black\".  In a moment you'll see that's true no matter how the information is represented internally.As with all of Julia's arrays, you can access individual elements:julia> img[1,2]\nRGB{U8}(0.0,1.0,0.0)One of the nice things about this representation of the image is that all of the indices in img[i,j,...] correspond to locations in the image: you don't need to worry about some dimensions of the array corresponding to \"color channels\" and other the spatial location, and you're guaranteed to get the entire pixel contents when you access that location.That said, occassionally there are reasons to want to treat RGB as a 3-component vector.  That's motivation for introducing our first view:julia> v = channelview(img)\n3×2×2 ImageCore.ChannelView{FixedPointNumbers.UFixed{UInt8,8},3,Array{ColorTypes.RGB{FixedPointNumbers.UFixed{UInt8,8}},2}}:\n[:, :, 1] =\n UFixed8(1.0)  UFixed8(0.0)\n UFixed8(0.0)  UFixed8(0.0)\n UFixed8(0.0)  UFixed8(1.0)\n\n[:, :, 2] =\n UFixed8(0.0)  UFixed8(0.0)\n UFixed8(1.0)  UFixed8(0.0)\n UFixed8(0.0)  UFixed8(0.0)v is a 3×2×2 array of numbers (UFixed8 is defined in FixedPointNumbers and can be abbreviated as U8), where the three elements of the first dimension correspond to the red, green, and blue color channels, respectively. channelview does exactly what the name suggests: provide a view of the array using separate channels for the color components.If you're not familiar with UFixed8, then you may find another view type, rawview, illuminating:julia> r = rawview(v)\n3×2×2 MappedArrays.MappedArray{UInt8,3,ImageCore.ChannelView{FixedPointNumbers.UFixed{UInt8,8},3,Array{ColorTypes.RGB{FixedPointNumbers.UFixed{UInt8,8}},2}},ImageCore.##11#13,ImageCore.##12#14{FixedPointNumbers.UFixed{UInt8,8}}}:\n[:, :, 1] =\n 0xff  0x00\n 0x00  0x00\n 0x00  0xff\n\n[:, :, 2] =\n 0x00  0x00\n 0xff  0x00\n 0x00  0x00This is an array of UInt8 numbers, with 0 printed as 0x00 and 255 printed as 0xff. Despite the apparent \"floating point\" representation of the image above, we see that it's actually represented using 8-bit unsigned integers.  The UFixed8 type presents such an integer as a fixed-point number ranging from 0 to 1.  As a consequence, there is no discrepancy in \"meaning\" between the encoding of images represented as floating point or 8-bit or 16-bit integers: 0 always means \"black\" and 1 always means \"white\" or \"saturated.\"Let's make a change in one of the entries:julia> r[3,1,1] = 128\n128\n\njulia> r\n3×2×2 MappedArrays.MappedArray{UInt8,3,ImageCore.ChannelView{FixedPointNumbers.UFixed{UInt8,8},3,Array{ColorTypes.RGB{FixedPointNumbers.UFixed{UInt8,8}},2}},ImageCore.##11#13,ImageCore.##12#14{FixedPointNumbers.UFixed{UInt8,8}}}:\n[:, :, 1] =\n 0xff  0x00\n 0x00  0x00\n 0x80  0xff\n\n[:, :, 2] =\n 0x00  0x00\n 0xff  0x00\n 0x00  0x00\n\njulia> v\n3×2×2 ImageCore.ChannelView{FixedPointNumbers.UFixed{UInt8,8},3,Array{ColorTypes.RGB{FixedPointNumbers.UFixed{UInt8,8}},2}}:\n[:, :, 1] =\n UFixed8(1.0)    UFixed8(0.0)\n UFixed8(0.0)    UFixed8(0.0)\n UFixed8(0.502)  UFixed8(1.0)\n\n[:, :, 2] =\n UFixed8(0.0)  UFixed8(0.0)\n UFixed8(1.0)  UFixed8(0.0)\n UFixed8(0.0)  UFixed8(0.0)\n\njulia> img\n2×2 Array{ColorTypes.RGB{FixedPointNumbers.UFixed{UInt8,8}},2}:\n RGB{U8}(1.0,0.0,0.502)  RGB{U8}(0.0,1.0,0.0)\n RGB{U8}(0.0,0.0,1.0)    RGB{U8}(0.0,0.0,0.0)The hexidecimal representation of 128 is 0x80; this is approximately halfway to 255, and as a consequence the UFixed8 representation is very near 0.5.  You can see the same change is reflected in r, v, and img: there is only one underlying array, img, and the two views simply reference it.Maybe you're used to having the color channel be the last dimension, rather than the first. We can achieve that using permuteddimsview:DocTestSetup = quote\n    using Colors, ImageCore\n    img = [RGB(1,0,0) RGB(0,1,0);\n           RGB(0,0,1) RGB(0,0,0)]\n    v = channelview(img)\n    r = rawview(v)\n    r[3,1,1] = 128\nendjulia> p = permuteddimsview(v, (2,3,1))\n2×2×3 Base.PermutedDimsArrays.PermutedDimsArray{FixedPointNumbers.UFixed{UInt8,8},3,(2,3,1),(3,1,2),ImageCore.ChannelView{FixedPointNumbers.UFixed{UInt8,8},3,Array{ColorTypes.RGB{FixedPointNumbers.UFixed{UInt8,8}},2}}}:\n[:, :, 1] =\n UFixed8(1.0)  UFixed8(0.0)\n UFixed8(0.0)  UFixed8(0.0)\n\n[:, :, 2] =\n UFixed8(0.0)  UFixed8(1.0)\n UFixed8(0.0)  UFixed8(0.0)\n\n[:, :, 3] =\n UFixed8(0.502)  UFixed8(0.0)\n UFixed8(1.0)    UFixed8(0.0)\n\njulia> p[1,2,:] = 0.25\n0.25\n\njulia> p\n2×2×3 Base.PermutedDimsArrays.PermutedDimsArray{FixedPointNumbers.UFixed{UInt8,8},3,(2,3,1),(3,1,2),ImageCore.ChannelView{FixedPointNumbers.UFixed{UInt8,8},3,Array{ColorTypes.RGB{FixedPointNumbers.UFixed{UInt8,8}},2}}}:\n[:, :, 1] =\n UFixed8(1.0)  UFixed8(0.251)\n UFixed8(0.0)  UFixed8(0.0)\n\n[:, :, 2] =\n UFixed8(0.0)  UFixed8(0.251)\n UFixed8(0.0)  UFixed8(0.0)\n\n[:, :, 3] =\n UFixed8(0.502)  UFixed8(0.251)\n UFixed8(1.0)    UFixed8(0.0)\n\njulia> v\n3×2×2 ImageCore.ChannelView{FixedPointNumbers.UFixed{UInt8,8},3,Array{ColorTypes.RGB{FixedPointNumbers.UFixed{UInt8,8}},2}}:\n[:, :, 1] =\n UFixed8(1.0)    UFixed8(0.0)\n UFixed8(0.0)    UFixed8(0.0)\n UFixed8(0.502)  UFixed8(1.0)\n\n[:, :, 2] =\n UFixed8(0.251)  UFixed8(0.0)\n UFixed8(0.251)  UFixed8(0.0)\n UFixed8(0.251)  UFixed8(0.0)\n\njulia> img\n2×2 Array{ColorTypes.RGB{FixedPointNumbers.UFixed{UInt8,8}},2}:\n RGB{U8}(1.0,0.0,0.502)  RGB{U8}(0.251,0.251,0.251)\n RGB{U8}(0.0,0.0,1.0)    RGB{U8}(0.0,0.0,0.0)Once again, p is a view, and as a consequence changing it leads to changes in all the coupled arrays and views."
},

{
    "location": "map.html#",
    "page": "Lazy transformation of values",
    "title": "Lazy transformation of values",
    "category": "page",
    "text": ""
},

{
    "location": "map.html#Lazy-transformation-of-values-1",
    "page": "Lazy transformation of values",
    "title": "Lazy transformation of values",
    "category": "section",
    "text": "In image display and input/output, it is sometimes necessary to transform the value (or the type) of individual pixels.  For example, if you want to view an image with an unconventional range (e.g., -1000 to 1000, for which the normal range 0=black to 1=white will not be very useful), then those values might need to be transformed before display. Likewise, if try to save an image to disk that contains some out-of-range or NaN values, you are likely to experience an error unless the values are put in a range that makes sense for the specific file format.There are several approaches to handling this problem. One is to compute a new image with scaled values, and for many users this may be the simplest option.  However, particularly with large images (or movies) this can present a performance problem.  In such cases, it's better to separate the concept of the \"map\" (transformation) function from the image (array) itself. (Here it's worth mentioning the MappedArrays package, which allows you to express lazy transformations on values for an entire array.)ImageCore contains several such transformation functions that are frequently useful when working with images. Some of these functions operate directly on values:clamp01\nclamp01nanThese two functions force the returned value to lie between 0 and 1, or each color channel to lie between 0 and 1 for color images. (clamp01nan forces NaN to 0, whereas clamp01 does not handle NaN.)A simple application of these functions is in saving images, where you may have some out-of-range values but don't care if they get truncated:img01 = clamp01nan.(img)img01 is safe to save to an image file, whereas trying to save img might possibly result in an error (depending on the contents of img).Other functions require parameters:scaleminmax\nscalesigned\ncolorsignedThese return a function rather than a value; that function can then be applied to pixels of the image.  For example:julia> f = scaleminmax(-10, 10)\n(::#9) (generic function with 1 method)\n\njulia> f(10)\n1.0\n\njulia> f(-10)\n0.0\n\njulia> f(5)\n0.75It's worth noting that you can combine these: for example, you can combine scalesigned and colorsigned to map real values to linear colormaps. For example, suppose we want to visualize some data, mapping negative values to green hues and positive values to magenta hues. Let's say the negative values are a bit more compressed, so we're going to map -5 to pure green and +20 to pure magenta. We can achieve this easily with the following:julia> sc = scalesigned(-5, 0, 20)  # maps [-5, 0, 20] -> [-1, 0, 1]\n(::#15) (generic function with 1 method)\n\njulia> col = colorsigned()          # maps -1 -> green, +1->magenta\n(::#17) (generic function with 1 method)\n\njulia> f = x->col(sc(x))            # combine the two\n(::#1) (generic function with 1 method)\n\njulia> f(-5)\nRGB{U8}(0.0,1.0,0.0)\n\njulia> f(20)\nRGB{U8}(1.0,0.0,1.0)\n\njulia> f(0)\nRGB{U8}(1.0,1.0,1.0)\n\njulia> f(10)\nRGB{U8}(1.0,0.502,1.0)Finally, takemap exists to automatically set the parameters of certain functions from the image itself.  For example,takemap(scaleminmax, A)will return a function that scales the minimum value of A to 0 and the maximum value of A to 1."
},

{
    "location": "traits.html#",
    "page": "Traits",
    "title": "Traits",
    "category": "page",
    "text": ""
},

{
    "location": "traits.html#Traits-1",
    "page": "Traits",
    "title": "Traits",
    "category": "section",
    "text": "ImageCore supports several \"traits\" that are sometimes useful in viewing or analyzing images. Many of these traits become much more powerful if you are using add-on packages like ImagesAxes, which allows you to give \"physical meaning\" to the different axes of your image.  Readers are encouraged to view the documentation for ImageAxes to gain a better appreciation of how to exploit these traits.  When using plain arrays to represent images, most of the traits default to \"trivial\" outcomes.Let's illustrate with a couple of examples:julia> using Colors, ImageCore\n\njulia> img = rand(RGB{U8}, 680, 480);\n\njulia> pixelspacing(img)\n(1,1)pixelspacing returns the spacing between adjacent pixels along each axis. Using ImagesAxes, you can even use physical units to encode this information, which might be important for microscopy or biomedical imaging.DocTestSetup = quote\n    using Colors, ImageCore\n    img = rand(RGB{U8}, 680, 480);\nendAnother simple trait is coords_spatial:julia> coords_spatial(img)\n(1,2)This trait indicates that both dimensions 1 and 2 are \"spatial dimensions,\" meaning they correspond to physical space. This trait again becomes more interesting with ImagesAxes, where you can denote that some axes correspond to time (e.g., for a movie).A full list of traits is presented in the reference section."
},

{
    "location": "reference.html#",
    "page": "Reference",
    "title": "Reference",
    "category": "page",
    "text": ""
},

{
    "location": "reference.html#Reference-1",
    "page": "Reference",
    "title": "Reference",
    "category": "section",
    "text": ""
},

{
    "location": "reference.html#ImageCore.channelview",
    "page": "Reference",
    "title": "ImageCore.channelview",
    "category": "Function",
    "text": "channelview(A)\n\nreturns a view of A, splitting out (if necessary) the color channels of A into a new first dimension. This is almost identical to ChannelView(A), except that if A is a ColorView, it will simply return the parent of A, or will use reinterpret when appropriate. Consequently, the output may not be a ChannelView array.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.ChannelView",
    "page": "Reference",
    "title": "ImageCore.ChannelView",
    "category": "Type",
    "text": "ChannelView(A)\n\ncreates a \"view\" of the Colorant array A, splitting out (if necessary) the separate color channels of eltype(A) into a new first dimension. For example, if A is a m-by-n RGB{U8} array, ChannelView(A) will return a 3-by-m-by-n U8 array. Color spaces with a single element (i.e., grayscale) do not add a new first dimension of A.\n\nOf relevance for types like RGB and BGR, the channels of the returned array will be in constructor-argument order, not memory order (see reinterpret if you want to use memory order).\n\nThe opposite transformation is implemented by ColorView.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.colorview",
    "page": "Reference",
    "title": "ImageCore.colorview",
    "category": "Function",
    "text": "colorview(C, A)\n\nreturns a view of the numeric array A, interpreting successive elements of A as if they were channels of Colorant C. This is almost identical to ColorView{C}(A), except that if A is a ChannelView, it will simply return the parent of A, or use reinterpret when appropriate. Consequently, the output may not be a ColorView array.\n\nExample\n\nA = rand(3, 10, 10)\nimg = colorview(RGB, A)\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.ColorView",
    "page": "Reference",
    "title": "ImageCore.ColorView",
    "category": "Type",
    "text": "ColorView{C}(A)\n\ncreates a \"view\" of the numeric array A, interpreting the first dimension of A as if were the channels of a Colorant C. The first dimension must have the proper number of elements for the constructor of C. For example, if A is a 3-by-m-by-n U8 array, ColorView{RGB}(A) will create an m-by-n array with element type RGB{U8}. Color spaces with a single element (i.e., grayscale) do not \"consume\" the first dimension of A.\n\nOf relevance for types like RGB and BGR, the elements of A are interpreted in constructor-argument order, not memory order (see reinterpret if you want to use memory order).\n\nThe opposite transformation is implemented by ChannelView.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.rawview",
    "page": "Reference",
    "title": "ImageCore.rawview",
    "category": "Function",
    "text": "rawview(img::AbstractArray{FixedPoint})\n\nreturns a \"view\" of img where the values are interpreted in terms of their raw underlying storage. For example, if img is an Array{U8}, the view will act like an Array{UInt8}.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.ufixedview",
    "page": "Reference",
    "title": "ImageCore.ufixedview",
    "category": "Function",
    "text": "ufixedview([T], img::AbstractArray{Unsigned})\n\nreturns a \"view\" of img where the values are interpreted in terms of UFixed number types. For example, if img is an Array{UInt8}, the view will act like an Array{UFixed8}.  Supply T if the element type of img is UInt16, to specify whether you want a UFixed10, UFixed12, UFixed14, or UFixed16 result.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.permuteddimsview",
    "page": "Reference",
    "title": "ImageCore.permuteddimsview",
    "category": "Function",
    "text": "permuteddimsview(A, perm)\n\nreturns a \"view\" of A with its dimensions permuted as specified by perm. This is like permutedims, except that it produces a view rather than a copy of A; consequently, any manipulations you make to the output will be mirrored in A. Compared to the copy, the view is much faster to create, but generally slower to use.\n\n\n\n"
},

{
    "location": "reference.html#List-of-view-types-1",
    "page": "Reference",
    "title": "List of view types",
    "category": "section",
    "text": "With that as an introduction, let's list all the view types supported by this package.  channelview and colorview are opposite transformations, as are rawview and ufixedview. channelview and colorview typically create objects of type ChannelView and ColorView, respectively, unless they are \"undoing\" a previous view of the opposite type.channelview\nChannelView\ncolorview\nColorView\nrawview\nufixedview\npermuteddimsview"
},

{
    "location": "reference.html#ImageCore.clamp01",
    "page": "Reference",
    "title": "ImageCore.clamp01",
    "category": "Function",
    "text": "clamp01(x) -> y\n\nProduce a value y that lies between 0 and 1, and equal to x when x is already in this range. Equivalent to clamp(x, 0, 1) for numeric values. For colors, this function is applied to each color channel separately.\n\nSee also: clamp01nan.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.clamp01nan",
    "page": "Reference",
    "title": "ImageCore.clamp01nan",
    "category": "Function",
    "text": "clamp01nan(x) -> y\n\nSimilar to clamp01, except that any NaN values are changed to 0.\n\nSee also: clamp01.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.scaleminmax",
    "page": "Reference",
    "title": "ImageCore.scaleminmax",
    "category": "Function",
    "text": "scaleminmax(min, max) -> f\nscaleminmax(T, min, max) -> f\n\nReturn a function f which maps values less than or equal to min to 0, values greater than or equal to max to 1, and uses a linear scale in between. min and max should be real values.\n\nOptionally specify the return type T. If T is a colorant (e.g., RGB), then scaling is applied to each color channel.\n\nExamples\n\nExample 1\n\njulia> f = scaleminmax(-10, 10) (::#9) (generic function with 1 method)\n\njulia> f(10) 1.0\n\njulia> f(-10) 0.0\n\njulia> f(5) 0.75\n\nExample 2\n\njulia> c = RGB(255.0,128.0,0.0) RGB{Float64}(255.0,128.0,0.0)\n\njulia> f = scaleminmax(RGB, 0, 255) (::#13) (generic function with 1 method)\n\njulia> f(c) RGB{Float64}(1.0,0.5019607843137255,0.0)\n\nSee also: takemap.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.scalesigned",
    "page": "Reference",
    "title": "ImageCore.scalesigned",
    "category": "Function",
    "text": "scalesigned(maxabs) -> f\n\nReturn a function f which scales values in the range [-maxabs, maxabs] (clamping values that lie outside this range) to the range [-1, 1].\n\nSee also: colorsigned.\n\n\n\nscalesigned(min, center, max) -> f\n\nReturn a function f which scales values in the range [min, center] to [-1,0] and [center,max] to [0,1]. Values smaller than min/max get clamped to min/max, respectively.\n\nSee also: colorsigned.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.colorsigned",
    "page": "Reference",
    "title": "ImageCore.colorsigned",
    "category": "Function",
    "text": "colorsigned()\ncolorsigned(colorneg, colorpos) -> f\ncolorsigned(colorneg, colorcenter, colorpos) -> f\n\nDefine a function that maps negative values (in the range [-1,0]) to the linear colormap between colorneg and colorcenter, and positive values (in the range [0,1]) to the linear colormap between colorcenter and colorpos.\n\nThe default colors are:\n\ncolorcenter: white\ncolorneg: green1\ncolorpos: magenta\n\nSee also: scalesigned.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.takemap",
    "page": "Reference",
    "title": "ImageCore.takemap",
    "category": "Function",
    "text": "takemap(f, A) -> fnew\ntakemap(f, T, A) -> fnew\n\nGiven a value-mapping function f and an array A, return a \"concrete\" mapping function fnew. When applied to elements of A, fnew should return valid values for storage or display, for example in the range from 0 to 1 (for grayscale) or valid colorants. fnew may be adapted to the actual values present in A, and may not produce valid values for any inputs not in A.\n\nOptionally one can specify the output type T that fnew should produce.\n\nExample:\n\njulia> A = [0, 1, 1000];\n\njulia> f = takemap(scaleminmax, A)\n(::#7) (generic function with 1 method)\n\njulia> f.(A)\n3-element Array{Float64,1}:\n 0.0\n 0.001\n 1.0\n\n\n\n"
},

{
    "location": "reference.html#List-of-value-transformations-(map-functions)-1",
    "page": "Reference",
    "title": "List of value-transformations (map functions)",
    "category": "section",
    "text": "clamp01\nclamp01nan\nscaleminmax\nscalesigned\ncolorsigned\ntakemap"
},

{
    "location": "reference.html#ImageCore.pixelspacing",
    "page": "Reference",
    "title": "ImageCore.pixelspacing",
    "category": "Function",
    "text": "pixelspacing(img) -> (sx, sy, ...)\n\nReturn a tuple representing the separation between adjacent pixels along each axis of the image.  Defaults to (1,1,...).  Use ImagesAxes for images with anisotropic spacing or to encode the spacing using physical units.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.spacedirections",
    "page": "Reference",
    "title": "ImageCore.spacedirections",
    "category": "Function",
    "text": "spacedirections(img) -> (axis1, axis2, ...)\n\nReturn a tuple-of-tuples, each axis[i] representing the displacement vector between adjacent pixels along spatial axis i of the image array, relative to some external coordinate system (\"physical coordinates\").\n\nBy default this is computed from pixelspacing, but you can set this manually using ImagesMeta.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.sdims",
    "page": "Reference",
    "title": "ImageCore.sdims",
    "category": "Function",
    "text": "sdims(img)\n\nReturn the number of spatial dimensions in the image. Defaults to the same as ndims, but with ImagesAxes you can specify that some axes correspond to other quantities (e.g., time) and thus not included by sdims.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.coords_spatial",
    "page": "Reference",
    "title": "ImageCore.coords_spatial",
    "category": "Function",
    "text": "coords_spatial(img)\n\nReturn a tuple listing the spatial dimensions of img.\n\nNote that a better strategy may be to use ImagesAxes and take slices along the time axis.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.size_spatial",
    "page": "Reference",
    "title": "ImageCore.size_spatial",
    "category": "Function",
    "text": "size_spatial(img)\n\nReturn a tuple listing the sizes of the spatial dimensions of the image. Defaults to the same as size, but using ImagesAxes you can mark some axes as being non-spatial.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.indices_spatial",
    "page": "Reference",
    "title": "ImageCore.indices_spatial",
    "category": "Function",
    "text": "indices_spatial(img)\n\nReturn a tuple with the indices of the spatial dimensions of the image. Defaults to the same as indices, but using ImagesAxes you can mark some axes as being non-spatial.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.nimages",
    "page": "Reference",
    "title": "ImageCore.nimages",
    "category": "Function",
    "text": "nimages(img)\n\nReturn the number of time-points in the image array. Defaults to\n\nUse ImagesAxes if you want to use an explicit time dimension.\n\n\n\n"
},

{
    "location": "reference.html#ImageCore.assert_timedim_last",
    "page": "Reference",
    "title": "ImageCore.assert_timedim_last",
    "category": "Function",
    "text": "assert_timedim_last(img)\n\nThrow an error if the image has a time dimension that is not the last dimension.\n\n\n\n"
},

{
    "location": "reference.html#List-of-traits-1",
    "page": "Reference",
    "title": "List of traits",
    "category": "section",
    "text": "pixelspacing\nspacedirections\nsdims\ncoords_spatial\nsize_spatial\nindices_spatial\nnimages\nassert_timedim_last"
},

]}