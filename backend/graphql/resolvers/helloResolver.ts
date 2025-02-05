import HelloService from "../../services/implementation/helloImplementation";
import IHelloService from "../../services/interface/helloInterface";

const helloService: IHelloService = new HelloService();

const helloResolver = {
    Query: {
        hello: (_parent: undefined): string => {
            return helloService.hello();
        },
    }
};

export default helloResolver;