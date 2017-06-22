package test.test2;

import MyOtherPackage.MyOtherClass;

/**
* This is a test of a block comment
* Just testing like a boss
* Removing it when we parse it out
*/
public class ThisClass extends MyOtherClass {

  // this is an int
	public int a = 0;
  // this is another int
	private int b = 1;

  // look at this public function
  /**
   * @return int
   */
	public int add() {
		return this.a + this.b;
	}

  /*
    This one is static*/
	public static int add(int a, int b) {
		return a + b;
	}

  //Cool beens yo!
	private int subtract() {
		return this.a - this.b;
	}
}
