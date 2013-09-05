module.declare("Utilities/Set", [], function () {

  var Set = (function () {
    function Set () {
      this.items = [];
    }

    Set.prototype.toArray = function () {
      return [].concat(this.items);
    };

    Set.prototype.add = function (new_item) {
      if (this.items.indexOf(new_item) != -1) return false;

      this.items.push(new_item);

      return new_item;
    };

    Set.prototype.addAll = function (new_items_arr) {
      var all_unique = true;
      for (var i = 0; i < new_items_arr.length; i++) {
        all_unique = this.add(new_items_arr[i]) && all_unique;
      }
      return all_unique;
    };

    Set.prototype.remove = function (rm_item) {
      if (this.items.indexOf(rm_item) == -1) return false;

      return this.items.splice(this.items.indexOf(rm_item), 1);
    };

    Set.prototype.removeAll = function (rm_items_arr) {
      var all_found = true;
      for (var i = 0; i < rm_items_arr.length; i++) {
        all_found = !!(this.remove(rm_items_arr[i])) && all_found;
      }
      return all_found;
    };

    Set.prototype.clear = function () {
      var old_items = this.items;
      this.items = [];
      return old_items;
    };

    Set.prototype.contains = function (test_item) {
      return (this.items.indexOf(test_item) != -1);
    };

    Set.prototype.or = 
    Set.prototype.union = function (other_set) {
      var new_set = new Set();
      new_set.addAll(this.toArray());
      new_set.addAll(other_set.toArray());
      return new_set;
    };

    Set.prototype.and =
    Set.prototype.intersection = function (other_set) {
      var new_set = new Set();
      var arr_self = this.toArray();
      for (var i = 0; i < arr_self.length; i++) {
        if (other_set.contains(arr_self[i])) {
          new_set.add(arr_self[i]);
        }
      }
      return new_set;
    };

    Set.prototype.not = 
    Set.prototype.difference = function (other_set) {
      var new_set = new Set();
      var arr_self = this.toArray();
      for (var i = 0; i < arr_self.length; i++) {
        if (!other_set.contains(arr_self[i])) {
          new_set.add(arr_self[i]);
        }
      }
      return new_set;
    };

    Set.prototype.xor = function (other_set) {
      return (this.difference(other_set)).union(other_set.difference(this));
    };

    Set.prototype.subset = function (other_set) {
      var arr_other = other_set.toArray();
      for (var i = 0; i < arr_other.length; i++) {
        if (!this.contains(arr_other[i])) {
          return false;
        }
      }
      return true;
    };

    return Set;
  })();

  return Set;

});
