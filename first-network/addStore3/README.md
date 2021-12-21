## Adding Org3 to the test network

You can use the `addStore3.sh` script to add another organization to the Fabric test network. The `addStore3.sh` script generates the store3 crypto material, creates an Org3 organization definition, and adds store 3 to a channel on the test network.

You first need to run `./network.sh up createChannel` in the `first-network` directory before you can run the `addStore3.sh` script.

```
./network.sh up createChannel
cd addStore3
./addStore3.sh up
```

If you used `network.sh` to create a channel other than the default `storechannel`, you need pass that name to the `addStore3.sh` script.
```
./network.sh up createChannel -c channel1
cd addStore3
./addStore3.sh up -c channel1
```

You can also re-run the `addStore3.sh` script to add Org3 to additional channels.
```
cd ..
./network.sh createChannel -c channel2
cd addStore3
./addStore3.sh up -c channel2
```

For more information, use `./addStore3.sh -h` to see the `addStore3.sh` help text.
