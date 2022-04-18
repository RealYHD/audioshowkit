# AudioShowKit

A library that makes visualizing audio data live a much simpler process.

## Getting Started

As this library has not been published as a package, the best way to use it is to go to download the latest successful build artifact which can be [found here](https://dev.sys.reslate.xyz/dev-auto/job/AudioShowKit/job/master/). This build artifact is a minified and bundled version of all the components in the library.

From here, add the downloaded javascript bundle to your html as you would any other javascript file:
```
<script src="./audioshowkit.js" defer></script>
```

Now, any script that is loaded after the `audioshowkit.js` script loads will have access to the `audioshowkit` object. Prepared are three tutorials with demonstrations. I recommend starting with the Music Playlist tutorial.

## Documentation

[The documentation can be found here](https://dev.sys.reslate.xyz/dev-auto/job/AudioShowKit/job/master/AudioShowKit_20JSDocs/) along with the rest of the tutorials and demonstrations. It should be noted that the documentation is produced in the format of modules, as this library can be used modularly, or as a bundle as described above. **Please see the actual classes and global functions for the documentation as the module section is solely indended to describe the organization of the library**. To elaborate, any component that is described in the documentation can be found in the `audioshowkit` object by replacing the `/` in the module path with `.`. In other words, `mappings/dimensions` becomes `audioshowkit.mappings.dimensions`.