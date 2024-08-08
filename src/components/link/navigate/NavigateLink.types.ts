export type INavigateLinkProps =
	| {
			isBack: true;
			nextPage?: null;
	  }
	| {
			isBack: false;
			nextPage: string;
	  };
