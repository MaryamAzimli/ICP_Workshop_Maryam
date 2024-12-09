actor {
  //var and let
  //stable = variable sifirlanmiyor
  // 0-dan bashlayib dogal numaralari = Nat
  stable var counter : Nat = 0;

  // async = durduk yere calismiyor
  public query func getCount() : async Nat {
    //update yapmiyorsak query eklemek olur (zorunlu degil)
    // "return counter" and "counter" are same, no specific need for return keywoard, the code checks last line
    return counter
  };

  public func increment() : async Nat {
    counter += 1;
    counter
  };

  public func decrement() : async Nat {
    if (counter != 0) counter -= 1;
    counter
  };
  public func reset(): async Nat {
    counter:=0;
    counter;
  };

  public func addValue(value: Nat, x: Text) : async Nat{
    counter +=value;
    counter;
  };
};
